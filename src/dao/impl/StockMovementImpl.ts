import { Repository } from "typeorm";
import { StockMovement } from "../../entity/StockMovement";
import { Product } from "../../entity/Product";
import { MovementType } from "../../enum/movementType";
import { OrderItemDTO } from "../../dto/orderItem-dto/orderItem-dto";
import { StockMovementDao } from "../StockMovementDao";
import { CommonPaginationDto } from "../../dto/commonPagination-dto";
import { AppDataSource } from "../../configuration/database-configuration";
import { Status } from "../../enum/status";
import { PaginationDto } from "../../dto/pagination-dto";

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

  async liststock(paginationDto: CommonPaginationDto): Promise<{ list: StockMovement[]; count: number }> {
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

    // Filter by movement type
    if (paginationDto.isStatus()) {
      query.andWhere("stockMovement.movementType = :type", { type: paginationDto.isStatus() });
    }
    const fromDate = paginationDto.getFromDate();
    const toDate = paginationDto.getToDate();


    if (fromDate && toDate) {

      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      query.andWhere("stockMovement.created_at BETWEEN :from AND :to", {
        from: start,
        to: end,
      });
    } else if (fromDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      query.andWhere("stockMovement.created_at >= :from", { from: start });
    } else if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      query.andWhere("stockMovement.created_at <= :to", { to: end });
    }

    // Pagination
    if (paginationDto.isIsReqPagination()) {
      query.skip(paginationDto.getStartIndex());
      query.take(paginationDto.getMaxResult());
    }



    const [list, count] = await query.getManyAndCount();

    return { list, count };

  }
}

