
import { Repository } from "typeorm";
import { AppDataSource } from "../../configuration/database-configuration";
import { CreateOrderDTO } from "../../dto/order-dto/createOrder-dto";
import { Order } from "../../entity/Order";
import { OrderStatus } from "../../enum/orderStatus";
import { Status } from "../../enum/status";
import { OrderDao } from "../orederDao";
import { CommonPaginationDto } from "../../dto/commonPagination-dto";



export class OrderDaoImpl implements OrderDao {

    async createOrder(order: CreateOrderDTO, orderRepo: Repository<Order>): Promise<Order> {
        let orderEnttity: Order = new Order();
        orderEnttity.orderNumber = "ORD-" + Date.now();
        orderEnttity.orderStatus = OrderStatus.DRAFT;
        orderEnttity.created_at = new Date();

        return orderEnttity;
    }


    async save(order: Order, orderRepo: Repository<Order>): Promise<Order> {

        order.updated_at = new Date();
        return await orderRepo.save(order);
    }


    async findOrderById(orderId: number): Promise<Order | null> {

        const orderRepo: Repository<Order> = AppDataSource.getRepository(Order);
        return await orderRepo.findOne({ where: { orderId } });


    }
    async listOrder(paginationDto: CommonPaginationDto): Promise<Order[]> {


        const orderRepo: Repository<Order> = AppDataSource.getRepository(Order);
        let query = orderRepo.createQueryBuilder("order")
            .leftJoinAndSelect("order.customer", "customer")
            .leftJoinAndSelect("order.user", "user")
            .leftJoinAndSelect("order.orderItem", "orderItem")
            .leftJoinAndSelect("orderItem.product", "product")
            .where("order.status = :status", { status: Status.ONLINE });


        if (paginationDto.getSearchText()) {

            const searchTerm = paginationDto.getSearchText().trim().toLowerCase();
            query.andWhere("LOWER(order.orderNumber) LIKE :search", { search: `%${searchTerm}%` });
        }


        if (paginationDto.isStatus() === OrderStatus.PAID) {
            query.andWhere("order.orderStatus = :orderStatus", { orderStatus: OrderStatus.PAID });
        }


        if (paginationDto.isIsReqPagination()) {
            query.skip(paginationDto.getStartIndex());
            query.take(paginationDto.getMaxResult());
        }

        return await query.getMany();
    }



}


