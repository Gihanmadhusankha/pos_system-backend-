import { Repository } from "typeorm";
import { AppDataSource } from "../../configuration/database-configuration";
import { User } from "../../entity/User";
import { UserDao } from "../userDao";
import { RegisterRequestDto } from "../../dto/user-dtos/register-dto";

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
}