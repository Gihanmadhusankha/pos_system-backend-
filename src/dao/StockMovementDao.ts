import { Repository } from "typeorm";
import { CreateOrderDTO } from "../dto/order-dto/createOrder-dto";
import { StockMovement } from "../entity/StockMovement";
import { CommonPaginationDto } from "../dto/commonPagination-dto";
import { OrderItemDTO } from "../dto/orderItem-dto/orderItem-dto";


export interface StockMovementDao {
    createMovement(items: OrderItemDTO, stockMovementRepo: Repository<StockMovement>): Promise<StockMovement>;
    liststock(paginationDto:CommonPaginationDto): Promise<StockMovement[]> ;
}