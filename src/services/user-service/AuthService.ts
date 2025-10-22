import { CommonResponse } from "../../common/dto/common-response";
import { LoginRequestDto } from "../../dto/user-dtos/login-dto";
import { RegisterRequestDto } from "../../dto/user-dtos/register-dto";


export interface AuthService {
    register(registerRequestDto: RegisterRequestDto): Promise<CommonResponse>;
    login(loginRequestDto: LoginRequestDto): Promise<CommonResponse>;
}