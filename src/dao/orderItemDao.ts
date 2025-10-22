import { Repository } from "typeorm";
import { CreateOrderDTO } from "../dto/order-dto/createOrder-dto";
import { OrderItem } from "../entity/OrderItem";
import { OrderItemDTO } from "../dto/orderItem-dto/orderItem-dto";

export interface OrderItemDao {
    createOrderItem(item: OrderItemDTO, orderItemRepo: Repository<OrderItem>): Promise<OrderItem>;
    save(orderItems: OrderItem[], orderItemRepo: Repository<OrderItem>): Promise<OrderItem[]>;
}