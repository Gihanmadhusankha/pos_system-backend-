import { Product } from "../../entity/Product";
import { ProductDao } from "../productDao";
import { Status } from "../../enum/status";
import { AppDataSource } from "../../configuration/database-configuration";
import { Repository } from "typeorm";
import { ManagaProductRequest } from "../../dto/product-dtos/manageProduct-dto";
import ValidationExceptionV2 from "../../services/exception/exception-impl/validation-exception-v2";
import { CodesRes } from "../../support/codes-sup";
import { ValidationType } from "../../enum/validation-type";
import { ValidationStatus } from "../../enum/validation-status";
import { CommonPaginationDto } from "../../dto/commonPagination-dto";

export class ProductDaoImpl implements ProductDao {

  async createProduct(manageProductRequest: ManagaProductRequest, productRepo: Repository<Product>): Promise<Product> {

    let productEntity: Product = new Product();
    productEntity.name = manageProductRequest.getName();
    productEntity.description = manageProductRequest.getDescription();
    productEntity.price = manageProductRequest.getPrice();
    productEntity.stock = manageProductRequest.getStock();
    productEntity.IsActive = manageProductRequest.isIsActive();
    productEntity.created_at = new Date();
    productEntity.updated_at = new Date();
    productEntity.status = Status.ONLINE;

    return await productRepo.save(productEntity);

  }

  async findByProductId(productId: number): Promise<Product | null> {

    const productRepo: Repository<Product> = AppDataSource.getRepository(Product);
    return await productRepo.findOne({ where: { productId } });

  }

  async updateProduct(manageProductRequest: ManagaProductRequest, productRepo: Repository<Product>): Promise<Product> {
    const product = await productRepo.findOne({ where: { productId: manageProductRequest.getProductId() } });

    if (!product) {
      throw new ValidationExceptionV2(CodesRes.notFoundException, "product not found", { code: ValidationType.PRODUCT_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null });
    }


    product.name = manageProductRequest.getName();
    product.description = manageProductRequest.getDescription();
    product.price = manageProductRequest.getPrice();
    product.stock = manageProductRequest.getStock();
    product.IsActive = manageProductRequest.isIsActive();
    product.updated_at = new Date();
    product.status = Status.ONLINE;

    return await productRepo.save(product);
  }


  async removeProduct(productId: number, productRepo: Repository<Product>): Promise<void> {

    const product = await productRepo.findOne({ where: { productId } });
    if (!product) {
      throw new ValidationExceptionV2(CodesRes.notFoundException, "product not found", { code: ValidationType.USER_ALREADY_EXIST, type: ValidationStatus.WARNING, msgParams: null });
    }

    product.status = Status.OFFLINE;
    await productRepo.save(product);
  }


  async listProduct(paginationDto: CommonPaginationDto): Promise<Product[]> {
    const productRepo: Repository<Product> = AppDataSource.getRepository(Product);

    let query = productRepo.createQueryBuilder("product")
       .where("product.status = :status", { status: Status.ONLINE });
    if (paginationDto.getSearchText()) {
      const searchTerm = paginationDto.getSearchText().trim().toLowerCase();
      query.andWhere("LOWER(product.name) LIKE :search", { search: `%${searchTerm}%` });
    }
    query.andWhere("product.IsActive = :active", { active: paginationDto.isStatus() });

    if (paginationDto.isIsReqPagination()) {
      query.skip(paginationDto.getStartIndex());
      query.take(paginationDto.getMaxResult());
    }

    return await query.getMany();
  }


  async save(product: Product, productRepo: Repository<Product>): Promise<Product> {
    return await productRepo.save(product);
  }
}



