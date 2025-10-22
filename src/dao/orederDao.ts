import { Repository } from "typeorm";
import { CreateOrderDTO } from "../dto/order-dto/createOrder-dto";
import { Order } from "../entity/Order";
import { OrderStatus } from "../enum/orderStatus";
import { CommonPaginationDto } from "../dto/commonPagination-dto";

export interface OrderDao {
    createOrder(order: CreateOrderDTO, orderRepo: Repository<Order>): Promise<Order>;
    findOrderById(orderId: number): Promise<Order | null>;
    listOrder(paginationDto: CommonPaginationDto): Promise<Order[]>;
    save(order: Order, orderRepo: Repository<Order>): Promise<Order>;
}