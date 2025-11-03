import { Repository } from "typeorm";
import { ManagaProductRequest } from "../dto/product-dtos/manageProduct-dto";
import { Product } from "../entity/Product";
import { CommonPaginationDto } from "../dto/commonPagination-dto";
import { loadRequestDTO } from "../dto/loadRequest-dto";

export interface ProductDao {

  createProduct(manageProductRequest: ManagaProductRequest, productRepo: Repository<Product>): Promise<Product>;
  findByProductId(productId: number): Promise<Product | null>;
  updateProduct(manageProductRequest: ManagaProductRequest, productRepo: Repository<Product>): Promise<Product>;
  removeProduct(productId: number, productRepo: Repository<Product>): Promise<void>;
  listProduct(paginationDto: CommonPaginationDto): Promise<{list:Product[];count:number}>;
  save(product: Product, productRepo: Repository<Product>): Promise<Product>;
   findProducts(loadRequest:loadRequestDTO):Promise<Product[]|null>;
  

}