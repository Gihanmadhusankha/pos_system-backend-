import { Repository } from "typeorm";
import { AppDataSource } from "../../configuration/database-configuration";
import { User } from "../../entity/User";
import { UserDao } from "../userDao";
import { RegisterRequestDto } from "../../dto/user-dtos/register-dto";
import { SearchDto } from "../../dto/search-dto";
import { Status } from "../../enum/status";
import { UserRole } from "../../enum/userRole";
import { ManageStaffRequest } from "../../dto/user-dtos/manageStaff-dto";
import ValidationExceptionV2 from "../../services/exception/exception-impl/validation-exception-v2";
import { CodesRes } from "../../support/codes-sup";
import { ValidationType } from "../../enum/validation-type";
import { ValidationStatus } from "../../enum/validation-status";

export class UserDaoImpl implements UserDao {

    async findByEmail(email: string): Promise<User | null> {
        const userRepo: Repository<User> = AppDataSource.getRepository(User);
        const query = userRepo
            .createQueryBuilder("user")
            .where("user.email=:email", { email });

        return await query.getOne();
    }

    async createUser(registerRequestDto: RegisterRequestDto, userRepo: Repository<User>): Promise<User> {

        let userEntity: User = new User();
        userEntity.name = registerRequestDto.getName();
        userEntity.email = registerRequestDto.getEmail();
        userEntity.password = registerRequestDto.getPassword();
        userEntity.role = registerRequestDto.getRole();
        userEntity.created_at = new Date();

        return await userRepo.save(userEntity);
    }

    async findById(userId: number): Promise<User | null> {
        const userRepo: Repository<User> = AppDataSource.getRepository(User);

        return await userRepo.findOneBy({ userId })
    }

    async addStaff(manageStaffDto: ManageStaffRequest, userRepo: Repository<User>): Promise<User> {

        let userEntity: User = new User();
        userEntity.name = manageStaffDto.getName();
        userEntity.email = manageStaffDto.getEmail();
        userEntity.password = manageStaffDto.getPassword();
        userEntity.role = manageStaffDto.getRole();
        userEntity.created_at = new Date();

        return await userRepo.save(userEntity);
    }
    async listStaff(paginationDto: SearchDto): Promise<User[]> {
        const userRepo: Repository<User> = AppDataSource.getRepository(User);


        let query = userRepo.createQueryBuilder("user")
            .where("user.status = :status", { status: Status.ONLINE })
            .andWhere("user.role = :role", { role: UserRole.STAFF });

        if (paginationDto.isIsReqPagination()) {
            query.skip(paginationDto.getStartIndex());
            query.take(paginationDto.getMaxResult());
        }

        return await query.getMany();
    }
    async updateUser(manageStaffDto: ManageStaffRequest, userRepo: Repository<User>): Promise<User> {
        const user = await userRepo.findOne({ where: { userId: manageStaffDto.getUserId() } });

        if (!user) {
            throw new ValidationExceptionV2(CodesRes.notFoundException, "user not found", { code: ValidationType.USER_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null });
        }


        user.name = manageStaffDto.getName();
        user.email = manageStaffDto.getEmail();
        user.password = manageStaffDto.getPassword();
        user.role = UserRole.STAFF;
        user.updated_at = new Date();
        user.status = Status.ONLINE;

        return await userRepo.save(user);
    }


    async removeUser(userId: number, userRepo: Repository<User>): Promise<void> {

        const user = await userRepo.findOne({ where: { userId } });
        if (!user) {
            throw new ValidationExceptionV2(CodesRes.notFoundException, "user not found", { code: ValidationType.USER_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null });
        }

        user.status = Status.OFFLINE;
        await userRepo.save(user);
    }
}