import { CommonResponse } from "../../common/dto/common-response";
import { SearchDto } from "../../dto/search-dto";
import { ManageStaffRequest } from "../../dto/user-dtos/manageStaff-dto";
import { LoginUserInfo } from "../../dto/system/login-user";
import { loadRequestDTO } from "../../dto/loadRequest-dto";

export interface StaffService {
    manage(userInfo: LoginUserInfo, manageStaffDto: ManageStaffRequest): Promise<CommonResponse>;
    staffList(userInfo: LoginUserInfo, paginationRequest: SearchDto): Promise<CommonResponse>;
    loadUser(loadRequest: loadRequestDTO, userInfo: LoginUserInfo): Promise<CommonResponse>;
}