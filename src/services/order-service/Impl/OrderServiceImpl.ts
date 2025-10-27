import { Repository } from "typeorm";
import { CommonResponse } from "../../../common/dto/common-response";
import { AppDataSource } from "../../../configuration/database-configuration";
import { CustomerDaoImpl } from "../../../dao/impl/customerDaoImpl";
import { OrderDaoImpl } from "../../../dao/impl/orderDaoImpl";
import { ProductDaoImpl } from "../../../dao/impl/productDaoImpl";
import { UserDaoImpl } from "../../../dao/impl/userDaoImpl";
import { CreateOrderDTO } from "../../../dto/order-dto/createOrder-dto";
import { OrderService } from "../OrderService";
import { Product } from "../../../entity/Product";
import { Customer } from "../../../entity/Customer";
import ValidationExceptionV2 from "../../exception/exception-impl/validation-exception-v2";
import { CodesRes } from "../../../support/codes-sup";
import { ValidationType } from "../../../enum/validation-type";
import { ValidationStatus } from "../../../enum/validation-status";
import { StockMovementDaoImpl } from "../../../dao/impl/StockMovementImpl";
import { OrderItem } from "../../../entity/OrderItem";
import { StockMovement } from "../../../entity/StockMovement";
import { OrderItemDaoImpl } from "../../../dao/impl/orderItemDaoImpl";
import { Order } from "../../../entity/Order";
import { CommonPaginationDto } from "../../../dto/commonPagination-dto";
import { OrderStatus } from "../../../enum/orderStatus";
import { Status } from "../../../enum/status";
import { MovementType } from "../../../enum/movementType";
import { CreateCustomerDTO } from "../../../dto/customer-dto/createCustomer-dto";
import { OrderItemDTO } from "../../../dto/orderItem-dto/orderItem-dto";
import { OrderResponseDTO } from "../../../dto/order-dto/orderResponse-dto";
import { CustomerResponseDTO } from "../../../dto/customer-dto/customerResponse-dto";
import { OrderItemResponseDTO } from "../../../dto/orderItem-dto/orderIteamResponse-dto";
import { LoginUserInfo } from "../../../dto/system/login-user";
import { UserRole } from "../../../enum/userRole";
import { UserResponseDTO } from "../../../dto/user-dtos/userResponse-dto";


export class OrderServiceImpl implements OrderService {
  private productDao = new ProductDaoImpl();
  private orderDao = new OrderDaoImpl();
  private customerDao = new CustomerDaoImpl();
  private userDao = new UserDaoImpl();
  private stockMovementDao = new StockMovementDaoImpl();
  private orderItemDao = new OrderItemDaoImpl();

  //---------------------CREATE ORDER-------------------------------

  async createOrder(userInfo: LoginUserInfo, createOrderRequest: CreateOrderDTO): Promise<CommonResponse> {
    const cr: CommonResponse = new CommonResponse();
    try {
      if (userInfo.getRole() !== UserRole.STAFF) {
        throw new ValidationExceptionV2(
          CodesRes.validationError,
          "Invalid User",
          { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }
        );
      }
      await AppDataSource.transaction(async (transactionManager) => {
        const orderRepo = transactionManager.getRepository(Order);
        const customerRepo = transactionManager.getRepository(Customer);
        const orderItemRepo = transactionManager.getRepository(OrderItem);
        const stockMovementRepo = transactionManager.getRepository(StockMovement);

        //  Fetch or create customer
        let customer = null;
        if (createOrderRequest.getCustomer()) {
          const customerBody = createOrderRequest.getCustomer();

          // Convert plain object to DTO instance
          const customerData = new CreateCustomerDTO();
          customerData.fillViaObject(customerBody);



          customer = await this.customerDao.findByEmail(customerData.getEmail());

          if (!customer) {
            customer = await this.customerDao.createCustomer(customerData, customerRepo);
          }


        } else {
          throw new ValidationExceptionV2(
            CodesRes.validationError,
            "Customer information is required",
            { code: ValidationType.CUSTOMER_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null }
          );
        }

        //  Validate user
        const user = await this.userDao.findById(userInfo.getUserId());
        if (!user) {
          throw new ValidationExceptionV2(
            CodesRes.validationError,
            "userId required to create the order",
            { code: ValidationType.USER_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null }
          );
        }

        //  Prepare OrderItems
        const orderItems: OrderItem[] = [];
        for (const itemBody of createOrderRequest.getItems()) {


          // Convert plain object to DTO instance
          const itemData = new OrderItemDTO();
          itemData.fillViaObject(itemBody);

          const product = await this.productDao.findByProductId(itemData.getProductId());

          if (!product) throw new ValidationExceptionV2(
            CodesRes.notFoundException,
            "Product not found",
            { code: ValidationType.PRODUCT_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null }
          );
          if (product.stock < itemData.getQuantity()) throw new ValidationExceptionV2(
            CodesRes.validationError,
            "Insufficient stock",
            { code: ValidationType.NOT_SUFFCIENT_STOCK, type: ValidationStatus.WARNING, msgParams: null }
          );

          // Decrement stock
          product.stock -= itemData.getQuantity();
          await transactionManager.save(product);

          // Create StockMovement
          await this.stockMovementDao.createMovement(itemData, stockMovementRepo);

          // Create OrderItem

          const orderItem = await this.orderItemDao.createOrderItem(itemData, orderItemRepo);

          // Set actual unitPrice (use the product we already fetched above)
          orderItem.unitPrice = product.price;
          orderItems.push(orderItem);
        }

        //  Create Order 
        const order = await this.orderDao.createOrder(createOrderRequest, orderRepo);

        // Set remaining fields
        order.customer = customer;
        order.user = user;
        order.orderItem = orderItems;
        order.total = orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

        // Link Order in each OrderItem
        for (const item of orderItems) {
          item.order = order;
        }

        //  Save OrderItems
        await this.orderItemDao.save(orderItems, orderItemRepo);

        //  Save Order with total
        await this.orderDao.save(order, orderRepo);

        //orderResponse
        cr.setExtra(await this.orderResponse(order));

      });

      cr.setStatus(true);
    } catch (error: any) {
      cr.setStatus(false);
      cr.setExtra(error.message);
      cr.setValidation({
        code: error.validationCode ?? ValidationType.SRV_SIDE_EXC,
        type: error.validationType ?? ValidationStatus.ERROR,
        msgParams: error.validationMsgParams ?? null,
      });
    }

    return cr;
  }

  private async orderResponse(order: Order): Promise<OrderResponseDTO> {
    let orderData: OrderResponseDTO = new OrderResponseDTO();
    orderData.setOrderId(order.orderId);
    orderData.setOrderNumber(order.orderNumber);
    orderData.setOrderStatus(order.orderStatus);
    orderData.setPlacedAt(order.created_at);
    orderData.setTotal(order.total);

    const customerResponse = new CustomerResponseDTO();
      customerResponse.setCustomerId(order.customer.customerId);
      customerResponse.setName(order.customer.name);
      customerResponse.setEmail(order.customer.email);
      customerResponse.setPhoneNumber(order.customer.phoneNumber);
      customerResponse.setAddress(order.customer.address);
    orderData.setCustomer(customerResponse);

    const itemsResponse: OrderItemResponseDTO[] = order.orderItem.map(item => {
      const itemDto = new OrderItemResponseDTO();
        itemDto.setProductId(item.product.productId);
        itemDto.setProductName(item.product.name);
        itemDto.setQuantity(item.quantity);
        itemDto.setUnitPrice(item.unitPrice);
      return itemDto;
    });
    orderData.setItems(itemsResponse);

    const userResponse: UserResponseDTO = new UserResponseDTO();
    userResponse.setName(order.user.name);
    orderData.setUser(userResponse);

    return orderData;
  }
  // ---------------------GET ORDER BY ID---------------------------------

  async getOrderById(userInfo: LoginUserInfo, orderId: number): Promise<CommonResponse> {
    const cr = new CommonResponse();
    try {
      if (userInfo.getRole() !== UserRole.STAFF) {
        throw new ValidationExceptionV2(
          CodesRes.validationError,
          "Invalid User",
          { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }
        );
      }
      const order = await this.orderDao.findOrderById(orderId);
      if (!order) {
        throw new ValidationExceptionV2(
          CodesRes.notFoundException,
          "Order not found",
          { code: ValidationType.ORDER_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null }
        );
      }

      cr.setStatus(true);
      cr.setExtra(await this.orderResponse(order));
    } catch (error: any) {
      console.log(error);
      cr.setStatus(false);
      cr.setExtra(error.message);
      cr.setValidation({
        code: error.validationCode ?? ValidationType.SRV_SIDE_EXC,
        type: error.validationType ?? ValidationStatus.ERROR,
        msgParams: error.validationMsgParams ?? null,
      });
    }
    return cr;
  }

  //---------------------------ORDER LIST------------------------------

  async orderList(userInfo: LoginUserInfo, paginationDto: CommonPaginationDto): Promise<CommonResponse> {
    const cr: CommonResponse = new CommonResponse();
    try {
      if (userInfo.getRole() !== UserRole.STAFF) {
        throw new ValidationExceptionV2(
          CodesRes.validationError,
          "Invalid User",
          { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }
        );
      }
      const orders = await this.orderDao.listOrder(paginationDto);
      const orderResponses = await Promise.all(
        orders.map(order => this.orderResponse(order))
      );
      cr.setStatus(true);
      cr.setExtra(orderResponses);
    } catch (error: any) {
      console.log(error);
      cr.setStatus(false);
      cr.setExtra(error.message);
      cr.setValidation({
        code: error.validationCode ?? ValidationType.SRV_SIDE_EXC,
        type: error.validationType ?? ValidationStatus.ERROR,
        msgParams: error.validationMsgParams ?? null,
      });
    }
    return cr;
  }


  // ---------------------------PAID ORDER-------------------------------

  async paidOrder(userInfo: LoginUserInfo, orderId: number): Promise<CommonResponse> {
    const cr: CommonResponse = new CommonResponse();
    try {
      if (userInfo.getRole() !== UserRole.STAFF) {
        throw new ValidationExceptionV2(
          CodesRes.validationError,
          "Invalid User",
          { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }
        );
      }
      await AppDataSource.transaction(async (transactionManager) => {
        const order = await this.orderDao.findOrderById(orderId);
        if (!order) {
          throw new ValidationExceptionV2(
            CodesRes.notFoundException,
            "Order not found",
            { code: ValidationType.ORDER_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null }
          );
        }

        if (order.orderStatus === OrderStatus.PAID) {
          throw new ValidationExceptionV2(
            CodesRes.validationError,
            "Order already paid",
            { code: ValidationType.ALREADY_PAID_THIS_ORDER, type: ValidationStatus.WARNING, msgParams: null }
          );
        }

        order.orderStatus = OrderStatus.PAID;
        await transactionManager.save(order);


        cr.setStatus(true);
        cr.setExtra("Order paid successfully");
      });
    } catch (error: any) {
      console.log(error);
      cr.setStatus(false);
      cr.setExtra(error.message);
      cr.setValidation({
        code: error.validationCode ?? ValidationType.SRV_SIDE_EXC,
        type: error.validationType ?? ValidationStatus.ERROR,
        msgParams: error.validationMsgParams ?? null,
      });
    }

    return cr;
  }


  //-----------------------CANCEL ORDER-------------------------------------

  async cancelOrder(userInfo: LoginUserInfo, orderId: number): Promise<CommonResponse> {
    const cr: CommonResponse = new CommonResponse();
    try {
      if (userInfo.getRole() !== UserRole.STAFF) {
        throw new ValidationExceptionV2(
          CodesRes.validationError,
          "Invalid User",
          { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }
        );
      }
      await AppDataSource.transaction(async (transactionManager) => {
        const orderRepo: Repository<Order> = transactionManager.getRepository(Order);
        const stockMovementRepo: Repository<StockMovement> = transactionManager.getRepository(StockMovement);
        const productRepo: Repository<Product> = transactionManager.getRepository(Product);

        const order = await this.orderDao.findOrderById(orderId);
        if (!order) {
          throw new ValidationExceptionV2(
            CodesRes.notFoundException,
            "Order not found",
            { code: ValidationType.ORDER_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null }
          );
        }

        if (order.orderStatus === OrderStatus.CANCELED) {
          throw new ValidationExceptionV2(
            CodesRes.validationError,
            "Order already cancelled",
            { code: ValidationType.ALREADY_CANCEL_THIS_ORDER, type: ValidationStatus.WARNING, msgParams: null }
          );
        }
        if (order.orderStatus === OrderStatus.PAID) {
          throw new ValidationExceptionV2(
            CodesRes.validationError,
            "Order already paid",
            { code: ValidationType.ALREADY_PAID_THIS_ORDER, type: ValidationStatus.WARNING, msgParams: null }
          );
        }

        for (const item of order.orderItem) {
          const product = item.product;

          // Restore product stock
          product.stock += item.quantity;
          await productRepo.save(product);

          // Create stock movement
          const stockMovement = stockMovementRepo.create({
            product,
            quantity: item.quantity,
            movementType: MovementType.CANCEL,
            created_at: new Date(),
            updated_at: new Date(),
            status: Status.ONLINE,
          });
          await stockMovementRepo.save(stockMovement);
        }

        order.orderStatus = OrderStatus.CANCELED;
        order.updated_at = new Date();
        await orderRepo.save(order);
      });

      cr.setStatus(true);
      cr.setExtra("Order cancelled successfully");
    } catch (error: any) {
      console.log(error);
      cr.setStatus(false);
      cr.setExtra(error.message);
      cr.setValidation({
        code: error.validationCode ?? ValidationType.SRV_SIDE_EXC,
        type: error.validationType ?? ValidationStatus.ERROR,
        msgParams: error.validationMsgParams ?? null,
      });
    }
    return cr;
  }
}