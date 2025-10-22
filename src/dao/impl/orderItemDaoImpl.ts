import { Repository } from "typeorm";
import { CreateOrderDTO } from "../../dto/order-dto/createOrder-dto";
import { OrderItem } from "../../entity/OrderItem";
import { OrderItemDao } from "../orderItemDao";
import { Product } from "../../entity/Product";
import { Status } from "../../enum/status";
import { OrderItemDTO } from "../../dto/orderItem-dto/orderItem-dto";


export class OrderItemDaoImpl implements OrderItemDao {
  async createOrderItem(itemData: OrderItemDTO, orderItemRepo: Repository<OrderItem>): Promise<OrderItem> {
    const orderItem = new OrderItem();

    const product = new Product();
    product.productId = itemData.getProductId();

    orderItem.product = product;
    orderItem.quantity = itemData.getQuantity();
    orderItem.unitPrice = 0;
    orderItem.created_at = new Date();
    orderItem.status = Status.ONLINE;

    await orderItemRepo.save(orderItem);

    return orderItem;
  }


  async save(orderItems: OrderItem[], orderItemRepo: Repository<OrderItem>): Promise<OrderItem[]> {
    return await orderItemRepo.save(orderItems);
  }
}