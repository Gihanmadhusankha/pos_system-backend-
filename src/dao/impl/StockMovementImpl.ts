import { Repository } from "typeorm";
import { StockMovement } from "../../entity/StockMovement";
import { Product } from "../../entity/Product";
import { MovementType } from "../../enum/movementType";
import { OrderItemDTO } from "../../dto/orderItem-dto/orderItem-dto";
import { StockMovementDao } from "../StockMovementDao";
import { CommonPaginationDto } from "../../dto/commonPagination-dto";
import { AppDataSource } from "../../configuration/database-configuration";
import { Status } from "../../enum/status";

export class StockMovementDaoImpl implements StockMovementDao {
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

 async liststock(paginationDto: CommonPaginationDto): Promise<StockMovement[]> {
  const stockMovementRepo: Repository<StockMovement> = AppDataSource.getRepository(StockMovement);

  let query = stockMovementRepo
    .createQueryBuilder("stockMovement")
    .leftJoinAndSelect("stockMovement.product", "product") 
    .where("stockMovement.status = :status", { status: Status.ONLINE });

  // Search by product name
  if (paginationDto.getSearchText()) {
    const searchTerm = paginationDto.getSearchText().trim().toLowerCase();
    query.andWhere("LOWER(product.name) LIKE :search", { search: `%${searchTerm}%` });
  }
   console.log(paginationDto.isStatus())
  if (paginationDto.isStatus()) {
    query.andWhere("stockMovement.movementType = :type", { type:MovementType.SALE });
  }

  
  if (paginationDto.isIsReqPagination()) {
    query.skip(paginationDto.getStartIndex());
    query.take(paginationDto.getMaxResult());
  }

  return await query.getMany();

}




}

