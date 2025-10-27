import { CommonResponse } from "../../common/dto/common-response";
import { loadRequestDTO } from "../../dto/loadRequest-dto";
import { CommonPaginationDto } from "../../dto/commonPagination-dto";
import { ManageCustomerRequest } from "../../dto/customer-dto/manageCustomerRequest-dto";
import { LoginUserInfo } from "../../dto/system/login-user";



export interface CustomerService {
    manageCustomer(manageCustomer: ManageCustomerRequest, userInfo: LoginUserInfo): Promise<CommonResponse>;
    customerList(paginationRequest: CommonPaginationDto, userInfo: LoginUserInfo): Promise<CommonResponse>;
    loadCustomer(loadRequest:loadRequestDTO,userInfo:LoginUserInfo):Promise<CommonResponse>;

}