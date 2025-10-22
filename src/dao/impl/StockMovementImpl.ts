import { Repository } from "typeorm";
import { StockMovement } from "../../entity/StockMovement";
import { Product } from "../../entity/Product";
import { MovementType } from "../../enum/movementType";
import { OrderItemDTO } from "../../dto/orderItem-dto/orderItem-dto";

export class StockMovementDaoImpl {
  async createMovement(
    itemData: OrderItemDTO,
    stockMovementRepo: Repository<StockMovement>
  ): Promise<StockMovement> {

    const stockMovement = new StockMovement();

    const product = new Product();
    product.productId = itemData.getProductId();

    stockMovement.product = product;
    stockMovement.quantity = itemData.getQuantity();
    stockMovement.movementType = MovementType.SALE;
    stockMovement.created_at = new Date();

    await stockMovementRepo.save(stockMovement);



    return stockMovement;
  }
}

