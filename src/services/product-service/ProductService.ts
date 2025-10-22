import { CommonResponse } from "../../common/dto/common-response";
import { ManagaProductRequest } from "../../dto/product-dtos/manageProduct-dto";
import { SearchDto } from "../../dto/search-dto";
import { LoginUserInfo } from "../../dto/system/login-user";


export interface ProductService {
  manageProduct(userInfo:LoginUserInfo,manageProductRequest: ManagaProductRequest): Promise<CommonResponse>;
  productList(userInfo:LoginUserInfo,paginationRequest:SearchDto): Promise<CommonResponse>;
}
