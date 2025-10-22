
import { Repository } from "typeorm";
import { AppDataSource } from "../../configuration/database-configuration";
import { ManageCustomerRequest } from "../../dto/customer-dto/manageCustomerRequest-dto";
import { Customer } from "../../entity/Customer";
import { Status } from "../../enum/status";
import { CustomerDao } from "../customerDao";
import ValidationExceptionV2 from "../../services/exception/exception-impl/validation-exception-v2";
import { CodesRes } from "../../support/codes-sup";
import { ValidationType } from "../../enum/validation-type";
import { ValidationStatus } from "../../enum/validation-status";
import { CommonPaginationDto } from "../../dto/commonPagination-dto";
import { CreateCustomerDTO } from "../../dto/customer-dto/createCustomer-dto";

export class CustomerDaoImpl implements CustomerDao {

  async createCustomer(customer: CreateCustomerDTO, customerRepo: Repository<Customer>): Promise<Customer> {

    let customerEntity: Customer = new Customer();
    customerEntity.name = customer.getName();
    customerEntity.email = customer.getEmail();
    customerEntity.phoneNumber = customer.getPhoneNumber();
    customerEntity.address = customer.getAddress();
    customerEntity.created_at = new Date();
    customerEntity.status = Status.ONLINE;

    return await customerRepo.save(customerEntity);
  }


  async findByCustomerId(customerId: number): Promise<Customer | null> {

    const customerRepo: Repository<Customer> = AppDataSource.getRepository(Customer);
    return await customerRepo.findOne({ where: { customerId } });

  }


  async updateCustomer(manageCustomer: ManageCustomerRequest, customerRepo: Repository<Customer>): Promise<Customer> {

    const customer = await customerRepo.findOne({ where: { customerId: manageCustomer.getCustomerId() } });

    if (!customer) {
      throw new ValidationExceptionV2(CodesRes.notFoundException, "customer not found", { code: ValidationType.CUSTOMER_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null });
    }

    customer.name = manageCustomer.getName();
    customer.email = manageCustomer.getEmail();
    customer.phoneNumber = manageCustomer.getPhoneNumber();
    customer.address = manageCustomer.getAddress();
    customer.updated_at = new Date();
    customer.status = Status.ONLINE;

    return await customerRepo.save(customer);
  }


  async removeCustomer(customerId: number): Promise<void> {

    const customerRepo: Repository<Customer> = AppDataSource.getRepository(Customer);
    const customer = await customerRepo.findOne({ where: { customerId } });

    if (!customer) {
      throw new ValidationExceptionV2(CodesRes.notFoundException, "customer not found", { code: ValidationType.CUSTOMER_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null });
    }

    customer.status = Status.OFFLINE;
    await customerRepo.save(customer);
  }

  async findByEmail(email: string): Promise<Customer | null> {

    const customerRepo: Repository<Customer> = AppDataSource.getRepository(Customer);

    return await customerRepo
      .createQueryBuilder("customer")
      .where("customer.email = :email", { email })
      .getOne();
  }


  async listCustomer(paginationDto: CommonPaginationDto): Promise<Customer[]> {

    const customerRepo: Repository<Customer> = AppDataSource.getRepository(Customer);

    let query = customerRepo.createQueryBuilder("customer")
      .where("customer.status = :status", { status: Status.ONLINE });

    if (paginationDto.getSearchText()) {
      const searchTerm = paginationDto.getSearchText().trim().toLowerCase();
      query.andWhere("LOWER(customer.name) LIKE :search", { search: `%${searchTerm}%` });
    }

    if (paginationDto.isIsReqPagination()) {
      query.skip(paginationDto.getStartIndex());
      query.take(paginationDto.getMaxResult());
    }

    return await query.getMany();
  }
}
