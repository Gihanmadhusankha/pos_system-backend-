import { Repository } from "typeorm";
import { ManageCustomerRequest } from "../dto/customer-dto/manageCustomerRequest-dto";
import { Customer } from "../entity/Customer";
import { CommonPaginationDto } from "../dto/commonPagination-dto";
import { CreateCustomerDTO } from "../dto/customer-dto/createCustomer-dto";
import { loadRequestDTO } from "../dto/loadRequest-dto";

export interface CustomerDao {
    createCustomer(customer: CreateCustomerDTO, customerRepo: Repository<Customer>): Promise<Customer>;
    findByCustomerId(productId: number): Promise<Customer | null>;
    updateCustomer(manageCustomer: ManageCustomerRequest, customerRepo: Repository<Customer>): Promise<Customer>;
    removeCustomer(customerId: number, customerRepo: Repository<Customer>): Promise<void>;
    findByEmail(email: string): Promise<Customer | null>;
    listCustomer(paginationDto: CommonPaginationDto): Promise<Customer[]>;
    findCustomer(loadRequest:loadRequestDTO):Promise<Customer |null>;
}