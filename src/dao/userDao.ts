import { Repository } from "typeorm";
import { User } from "../entity/User";
import { RegisterRequestDto } from "../dto/user-dtos/register-dto";
import { ManageStaffRequest } from "../dto/user-dtos/manageStaff-dto";
import { SearchDto } from "../dto/search-dto";
import { loadRequestDTO } from "../dto/loadRequest-dto";

export interface UserDao {
    findByEmail(email: string): Promise<User | null>;
    createUser(registerRequestDto: RegisterRequestDto | ManageStaffRequest, userRepo: Repository<User>): Promise<User>;
    findById(userId: number): Promise<User | null>;
    addStaff(manageStaffDto: ManageStaffRequest, userRepo: Repository<User>): Promise<User>;
    listStaff(paginationDto: SearchDto): Promise<User[]>;
    updateUser(manageStaffDto: ManageStaffRequest, userRepo: Repository<User>): Promise<User>;
    removeUser(userId: number, userRepo: Repository<User>): Promise<void>;
    findUser(loadRequest: loadRequestDTO): Promise<User |null>;

}
