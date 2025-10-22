import { Repository } from "typeorm";
import { User } from "../entity/User";
import { RegisterRequestDto } from "../dto/user-dtos/register-dto";

export interface UserDao {
    findByEmail(email: string): Promise<User | null>;
    createUser(registerRequestDto: RegisterRequestDto, userRepo: Repository<User>): Promise<User>;
    findById(userId: number): Promise<User | null>;
}