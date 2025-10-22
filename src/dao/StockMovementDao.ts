import { Repository } from "typeorm";
import { CreateOrderDTO } from "../dto/order-dto/createOrder-dto";
import { StockMovement } from "../entity/StockMovement";

export interface StockMovementDao {
    createMovement(items: CreateOrderDTO, stockMovementRepo: Repository<StockMovement>): Promise<StockMovement>;
}