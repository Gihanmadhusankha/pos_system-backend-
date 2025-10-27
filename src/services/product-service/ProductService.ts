import { CommonResponse } from "../../common/dto/common-response";
import { loadRequestDTO } from "../../dto/loadRequest-dto";
import { CommonPaginationDto } from "../../dto/commonPagination-dto";
import { ManagaProductRequest } from "../../dto/product-dtos/manageProduct-dto";
import { SearchDto } from "../../dto/search-dto";
import { LoginUserInfo } from "../../dto/system/login-user";


export interface ProductService {
  manageProduct(userInfo:LoginUserInfo,manageProductRequest: ManagaProductRequest): Promise<CommonResponse>;
  productList(userInfo:LoginUserInfo,paginationRequest:CommonPaginationDto): Promise<CommonResponse>;
  stockList(userInfo:LoginUserInfo,paginationRequest:CommonPaginationDto): Promise<CommonResponse>;
  loadProduct(loadRequest:loadRequestDTO):Promise<CommonResponse>;
}  
