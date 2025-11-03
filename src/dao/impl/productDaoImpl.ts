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
import { loadRequestDTO } from "../../dto/loadRequest-dto";

export class ProductDaoImpl implements ProductDao {

  async createProduct(manageProductRequest: ManagaProductRequest, productRepo: Repository<Product>): Promise<Product> {

    let productEntity: Product = new Product();
    productEntity.name = manageProductRequest.getName();
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


  async listProduct(paginationDto: CommonPaginationDto): Promise<{list:Product[];count:number}> {
    const productRepo: Repository<Product> = AppDataSource.getRepository(Product);

    let query = productRepo.createQueryBuilder("product")
      .where("product.status = :status", { status: Status.ONLINE })
      
      
    if (paginationDto.getSearchText()) {
      const searchTerm = paginationDto.getSearchText().trim().toLowerCase();
      query.andWhere("LOWER(product.name) LIKE :search", { search: `%${searchTerm}%` });
    }
   if (paginationDto.isStatus() !== null && paginationDto.isStatus() !== undefined) {
  query.andWhere("product.IsActive = :active", { active: paginationDto.isStatus() });
}


    if (paginationDto.isIsReqPagination()) {
      query.skip(paginationDto.getStartIndex());
      query.take(paginationDto.getMaxResult());
    }

     const [list, count] = await query.getManyAndCount();

        return { list, count };
  }


  async save(product: Product, productRepo: Repository<Product>): Promise<Product> {
    return await productRepo.save(product);
  }


 async findProducts(loadRequest: loadRequestDTO): Promise<Product[]> {
  const productRepo: Repository<Product> = AppDataSource.getRepository(Product);

  const query = productRepo.createQueryBuilder("product");

  query.where('product.status = :status',{status:Status.ONLINE})
  query.andWhere('product.IsActive = :isActive', { isActive: true })
  

  
  if (loadRequest.getId()) {
    query.andWhere("product.productId = :id", { id: loadRequest.getId() });
  }

  
  if (loadRequest.getSearchName()) {
    console.log(loadRequest.getSearchName())
    const searchTerm = loadRequest.getSearchName().trim().toLowerCase();
    if(searchTerm!==""){
      query.andWhere("LOWER(product.name) LIKE :search", { search: `%${searchTerm}%` });
    }
  }

  query.orderBy('product.name', 'ASC');
  
  // Limit results
  if (!loadRequest.getId() && !loadRequest.getSearchName()) {
    query.take(50); 
  } else {
    query.take(10);
  }

  const products = await query.getMany();
  return products;
}
}