import { Repository } from "typeorm";
import { CommonResponse } from "../../../common/dto/common-response";
import { AppDataSource } from "../../../configuration/database-configuration";
import { ProductDaoImpl } from "../../../dao/impl/productDaoImpl";
import { ProductDao } from "../../../dao/productDao";
import { ManagaProductRequest } from "../../../dto/product-dtos/manageProduct-dto";
import { Product } from "../../../entity/Product";
import { ProductService } from "../ProductService";
import ValidationExceptionV2 from "../../exception/exception-impl/validation-exception-v2";
import { CodesRes } from "../../../support/codes-sup";
import { ValidationType } from "../../../enum/validation-type";
import { ValidationStatus } from "../../../enum/validation-status";
import { ProductResponse } from "../../../dto/product-dtos/productResponse-dto";
import { CommonPaginationDto } from "../../../dto/commonPagination-dto";
import { LoginUserInfo } from "../../../dto/system/login-user";
import { UserRole } from "../../../enum/userRole";

export class ProductServiceImpl implements ProductService {
  private productDao: ProductDao = new ProductDaoImpl();

  //---------------------MANAGE PRODUCT---------------------

  async manageProduct(userInfo: LoginUserInfo, manageProductRequest: ManagaProductRequest): Promise<CommonResponse> {
    const cr: CommonResponse = new CommonResponse();

    try {
      if (userInfo.getRole() !== UserRole.ADMIN) {
        throw new ValidationExceptionV2(
          CodesRes.validationError,
          "Invalid User",
          { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }

        );
      }

      await AppDataSource.transaction(async (transactionManager) => {
        const productRepo: Repository<Product> = transactionManager.getRepository(Product);
        let product: Product | null = null;//product kiyala dekak define karala

        // Create Product
        if (manageProductRequest.isIsNew()) {
          product = await this.productDao.createProduct(manageProductRequest, productRepo);
        }

        // Update Product
        else if (manageProductRequest.isIsUpdate()) {
          if (!manageProductRequest.getProductId()) {
            throw new ValidationExceptionV2(
              CodesRes.notFoundException,
              "productId not found",
              { code: ValidationType.PRODUCT_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null }
            );
          }

          const existingProduct = await this.productDao.findByProductId(manageProductRequest.getProductId());
          if (!existingProduct) {
            throw new ValidationExceptionV2(
              CodesRes.notFoundException,
              "product not found",
              { code: ValidationType.PRODUCT_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null }
            );
          }

          product = await this.productDao.updateProduct(manageProductRequest, productRepo);
        }

        // Remove Product
        else if (manageProductRequest.isIsDelete()) {
          if (!manageProductRequest.getProductId()) {
            throw new ValidationExceptionV2(
              CodesRes.notFoundException,
              "productId not found",
              { code: ValidationType.PRODUCT_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null }
            );
          }

          const existingProduct = await this.productDao.findByProductId(manageProductRequest.getProductId());
          if (!existingProduct) {
            throw new ValidationExceptionV2(
              CodesRes.notFoundException,
              "product not found",
              { code: ValidationType.PRODUCT_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null }
            );
          }

          await this.productDao.removeProduct(manageProductRequest.getProductId(), productRepo);
        }

        // Invalid operation
        else {
          throw new ValidationExceptionV2(
            CodesRes.notFoundException,
            "Invalid product operation",
            { code: ValidationType.INVALID_OPERATION, type: ValidationStatus.WARNING, msgParams: null }
          );
        }

        // Prepare response data only if product exists (create/update)
        cr.setExtra(await this.ProductResponse(product));

      });

      cr.setStatus(true);
    } catch (error: any) {
      console.log(error);
      cr.setStatus(false);
      cr.setExtra(error.message);
      cr.setValidation({
        code: error.validationCode ?? ValidationType.SRV_SIDE_EXC,
        type: error.validationType ?? ValidationStatus.ERROR,
        msgParams: error.validationMsgParams ?? null,
      });
    }

    return cr;
  }

  private async ProductResponse(product: Product): Promise<ProductResponse> {

    let productData = new ProductResponse();
      productData.setProductId(product.productId);
      productData.setName(product.name);
      productData.setPrice(product.price);
      productData.setStock(product.stock);
      productData.setIsActive(product.IsActive);

    return productData;
  }

  //.............PRODUCT LIST------------------------

  async productList(userInfo: LoginUserInfo, paginationRequest: CommonPaginationDto): Promise<CommonResponse> {
    const cr: CommonResponse = new CommonResponse();
    try {
      if (userInfo.getRole() !== UserRole.ADMIN) {
        throw new ValidationExceptionV2(
          CodesRes.validationError,
          "Invalid User",
          { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }

        );
      }
      const products = await this.productDao.listProduct(paginationRequest);
      const productResponses = await Promise.all(
        products.map(product => this.ProductResponse(product))
      )


      cr.setStatus(true);
      cr.setExtra(productResponses);

    }
    catch (error: any) {
      console.log(error);
      cr.setStatus(false);
      cr.setExtra(error.message);
      cr.setValidation({
        code: error.validationCode ?? ValidationType.SRV_SIDE_EXC,
        type: error.validationType ?? ValidationStatus.ERROR,
        msgParams: error.validationMsgParams ?? null,
      });
    }

    return cr;
  }
}