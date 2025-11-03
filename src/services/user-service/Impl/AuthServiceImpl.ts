import { Repository } from "typeorm";
import { CommonResponse } from "../../../common/dto/common-response";
import { AppDataSource } from "../../../configuration/database-configuration";
import { UserDaoImpl } from "../../../dao/impl/userDaoImpl";
import { UserDao } from "../../../dao/userDao";
import { RegisterRequestDto } from "../../../dto/user-dtos/register-dto";
import { JwtHelper } from "../../../support/jwt-helper";
import { AuthService } from "../AuthService";
import { User } from "../../../entity/User";
import ValidationExceptionV2 from "../../exception/exception-impl/validation-exception-v2";
import { CodesRes } from "../../../support/codes-sup";
import { ValidationType } from "../../../enum/validation-type";
import { ValidationStatus } from "../../../enum/validation-status";
import bcrypt from "bcryptjs";
import { LoginRequestDto } from "../../../dto/user-dtos/login-dto";
import { UserDto } from "../../../dto/user-dtos/user-dto";
import { LoginUserInfo } from "../../../dto/system/login-user";
import { TokenType } from "../../../enum/token-type";


export class AuthServiceImpl implements AuthService {
    private userDao: UserDao = new UserDaoImpl();
    private jwtHelper: JwtHelper = new JwtHelper();

    // ----------------------USER REGISTER--------------------------------

    async register(registerRequestDto: RegisterRequestDto): Promise<CommonResponse> {
        let cr: CommonResponse = new CommonResponse();
        try {
            await AppDataSource.transaction(async (transactionManager) => {
                let userRepo: Repository<User> = transactionManager.getRepository(User);
                
                const existing = await this.userDao.findByEmail(registerRequestDto.getEmail());

                if (existing) {
                    throw new ValidationExceptionV2(CodesRes.duplicateRecord, "User Already Exists!", { code: ValidationType.USER_ALREADY_EXIST, type: ValidationStatus.WARNING, msgParams: null });
                }

                const hashedPassword = await bcrypt.hash(registerRequestDto.getPassword(), 10);
                registerRequestDto.setPassword(hashedPassword);

                const user = await this.userDao.createUser(registerRequestDto, userRepo);
            });

            cr.setStatus(true);
            cr.setExtra(ValidationType.USER_REGISTERED_SUCCESSFULLY);
        } catch (error) {
            console.log(error);
            cr.setStatus(false);
            cr.setExtra(error.message);
            cr.setValidation({ code: error.validationCode ? error.validationCode : ValidationType.SRV_SIDE_EXC, type: error.validationType ? error.validationType : ValidationStatus.ERROR, msgParams: error.validationMsgParams ? error.validationMsgParams : null });
        }
        return cr;
    }
      //------------------------USER LOGIN -----------------------------

    async login(loginRequestDto: LoginRequestDto): Promise<CommonResponse> {
        let cr: CommonResponse = new CommonResponse();
        try {
            const userRepo: Repository<User> = AppDataSource.getRepository(User);
            const user = await this.userDao.findByEmail(loginRequestDto.getEmail());
            if (!user) {
                throw new ValidationExceptionV2(CodesRes.validationError, "User not found", { code: ValidationType.USER_NOT_FOUND, type: ValidationStatus.ERROR, msgParams: null });
            }

            const isPasswordValid = await bcrypt.compare(loginRequestDto.getPassword(), user.password);

            if (!isPasswordValid) {
                throw new ValidationExceptionV2(CodesRes.validationError, "Invalid Email or Password", { code: ValidationType.INVALID_EMAIL_PASSWORD, type: ValidationStatus.ERROR, msgParams: null });
            }

            let userData: UserDto = new UserDto();
            userData.setUserId(user.userId);
            userData.setRole(user.role);

            let loginUserInfo: LoginUserInfo = new LoginUserInfo();
            loginUserInfo.setUserId(user.userId);
            loginUserInfo.setEmail(user.email);

            let jwtToken = this.jwtHelper.generateJwt(loginUserInfo, TokenType.AUTH);
            userData.setJwtToken(jwtToken);

            let refreshToken = this.jwtHelper.generateJwt(loginUserInfo, TokenType.REFRESH);
            userData.setRefreshToken(refreshToken);

            cr.setStatus(true);
            cr.setExtra(userData);
        } catch (error) {
            console.log(error);
            cr.setStatus(false);
            cr.setExtra(error.message);
            cr.setValidation({ code: error.validationCode ? error.validationCode : ValidationType.SRV_SIDE_EXC, type: error.validationType ? error.validationType : ValidationStatus.ERROR, msgParams: error.validationMsgParams ? error.validationMsgParams : null });
        }
        return cr;
    }

}
