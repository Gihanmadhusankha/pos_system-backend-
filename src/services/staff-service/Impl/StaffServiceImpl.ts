import { userInfo } from "os";
import { CommonResponse } from "../../../common/dto/common-response";
import { ManageStaffRequest } from "../../../dto/user-dtos/manageStaff-dto";
import { StaffService } from "../StaffService";
import { UserRole } from "../../../enum/userRole";
import ValidationExceptionV2 from "../../exception/exception-impl/validation-exception-v2";
import { CodesRes } from "../../../support/codes-sup";
import { ValidationType } from "../../../enum/validation-type";
import { ValidationStatus } from "../../../enum/validation-status";
import { LoginUserInfo } from "../../../dto/system/login-user";
import { AppDataSource } from "../../../configuration/database-configuration";
import { Repository } from "typeorm";
import { User } from "../../../entity/User";
import { UserDao } from "../../../dao/userDao";
import { UserDaoImpl } from "../../../dao/impl/userDaoImpl";
import { SearchDto } from "../../../dto/search-dto";
import bcrypt from "bcryptjs";
import { UserResponseDTO } from "../../../dto/user-dtos/userResponse-dto";
import { loadRequestDTO } from "../../../dto/loadRequest-dto";

export class StaffServiceImpl implements StaffService {


    private userDao: UserDao = new UserDaoImpl();

    //-----------------------STAFF MANAGE--------------------------

    async manage(userInfo: LoginUserInfo, manageStaffDto: ManageStaffRequest): Promise<CommonResponse> {
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
                const userRepo: Repository<User> = transactionManager.getRepository(User);

                const existing = await this.userDao.findByEmail(manageStaffDto.getEmail());

                if (existing) {
                    throw new ValidationExceptionV2(CodesRes.duplicateRecord, "User Already Exists!", { code: ValidationType.USER_ALREADY_EXIST, type: ValidationStatus.WARNING, msgParams: null });
                }

                const hashedPassword = await bcrypt.hash(manageStaffDto.getPassword(), 10);
                manageStaffDto.setPassword(hashedPassword);


                let user: User | null = null;
                if (manageStaffDto.isIsNew()) {
                    user = await this.userDao.createUser(manageStaffDto, userRepo);
                }
                else if (manageStaffDto.isIsUpdate()) {
                    if (!manageStaffDto.getUserId()) {
                        throw new ValidationExceptionV2(
                            CodesRes.notFoundException,
                            "user not found",
                            { code: ValidationType.USER_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null }
                        );
                    }
                    const existingUser = await this.userDao.findById(manageStaffDto.getUserId());
                    if (!existingUser) {
                        if (!manageStaffDto.getUserId()) {
                            throw new ValidationExceptionV2(
                                CodesRes.notFoundException,
                                "user not found",
                                { code: ValidationType.USER_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null }
                            );

                        }

                    }
                    user = await this.userDao.updateUser(manageStaffDto, userRepo);



                } else if (manageStaffDto.isIsDelete()) {
                    if (!manageStaffDto.getUserId()) {
                        throw new ValidationExceptionV2(
                            CodesRes.notFoundException,
                            "user not found",
                            { code: ValidationType.USER_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null }
                        );
                    }
                    const existingUser = await this.userDao.findById(manageStaffDto.getUserId());
                    if (!existingUser) {
                        if (!manageStaffDto.getUserId()) {
                            throw new ValidationExceptionV2(
                                CodesRes.notFoundException,
                                "user not found",
                                { code: ValidationType.USER_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null }
                            );

                        }

                    }
                    await this.userDao.removeUser(manageStaffDto.getUserId(), userRepo);

                }
                else {
                    throw new ValidationExceptionV2(
                        CodesRes.notFoundException,
                        "Invalid  operation",
                        { code: ValidationType.INVALID_OPERATION, type: ValidationStatus.WARNING, msgParams: null }
                    );
                }


                cr.setExtra("user manage successfully");

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

    //-------------------------------STAFF LIST------------------------

    async staffList(userInfo: LoginUserInfo, paginationRequest: SearchDto): Promise<CommonResponse> {
        const cr: CommonResponse = new CommonResponse();
        try {
            if (userInfo.getRole() !== UserRole.ADMIN) {
                throw new ValidationExceptionV2(
                    CodesRes.validationError,
                    "Invalid User",
                    { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }

                );
            }
            const users = await this.userDao.listStaff(paginationRequest);
            const userResponses = await Promise.all(
                users.map(user => this.UserResponse(user))
            )


            cr.setStatus(true);
            cr.setExtra(userResponses);

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

    private async UserResponse(user: User): Promise<UserResponseDTO> {
        let userData = new UserResponseDTO();
        userData.setUserId(user.userId);
        userData.setName(user.name);
        userData.setEmail(user.email);


        return userData;
    }

    //--------------------LOAD USER-------------------------------

    async loadUser(loadRequest: loadRequestDTO, userInfo: LoginUserInfo): Promise<CommonResponse> {
        const cr: CommonResponse = new CommonResponse()
        try {
            if (userInfo.getRole() !== UserRole.STAFF) {
                throw new ValidationExceptionV2(
                    CodesRes.validationError,
                    "Invalid User",
                    { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }
                );
            }
            const user = await this.userDao.findUser(loadRequest);

            cr.setStatus(true);
            if (user) {
                cr.setExtra(this.UserResponse(user));
            }
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
}