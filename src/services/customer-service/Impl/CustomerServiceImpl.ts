import { Repository } from "typeorm";
import { CommonResponse } from "../../../common/dto/common-response";
import { AppDataSource } from "../../../configuration/database-configuration";
import { CustomerDao } from "../../../dao/customerDao";
import { CustomerDaoImpl } from "../../../dao/impl/customerDaoImpl";
import { ManageCustomerRequest } from "../../../dto/customer-dto/manageCustomerRequest-dto";
import { Customer } from "../../../entity/Customer";
import { CustomerService } from "../CustomerService";
import ValidationExceptionV2 from "../../exception/exception-impl/validation-exception-v2";
import { CodesRes } from "../../../support/codes-sup";
import { ValidationType } from "../../../enum/validation-type";
import { ValidationStatus } from "../../../enum/validation-status";
import { CustomerResponseDTO } from "../../../dto/customer-dto/customerResponse-dto";
import { CommonPaginationDto } from "../../../dto/commonPagination-dto";
import { UserRole } from "../../../enum/userRole";
import { LoginUserInfo } from "../../../dto/system/login-user";
import { loadRequestDTO } from "../../../dto/loadRequest-dto";
import { count } from "console";

export class CustomerServiceImpl implements CustomerService {
  private customerDao: CustomerDao = new CustomerDaoImpl();

  //----------------CUSTOMER MANAGE--------------------------------

  async manageCustomer(
    manageCustomer: ManageCustomerRequest,
    userInfo: LoginUserInfo
  ): Promise<CommonResponse> {
    const cr = new CommonResponse();
    try {
      if (userInfo.getRole() !== UserRole.STAFF) {
        throw new ValidationExceptionV2(
          CodesRes.validationError,
          "Invalid User",
          { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }
        );
      }

      let customer: Customer | null = null;

      await AppDataSource.transaction(async (transactionManager) => {
        const customerRepo: Repository<Customer> = transactionManager.getRepository(Customer);

        // --- Update existing customer ---
        if (manageCustomer.isIsUpdate()) {
          if (!manageCustomer.getCustomerId()) {
            throw new ValidationExceptionV2(
              CodesRes.notFoundException,
              "CustomerId not found",
              { code: ValidationType.CUSTOMER_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null }
            );
          }

          const existingCustomer = await this.customerDao.findByCustomerId(manageCustomer.getCustomerId());
          if (!existingCustomer) {
            throw new ValidationExceptionV2(
              CodesRes.notFoundException,
              "Customer not found",
              { code: ValidationType.CUSTOMER_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null }
            );
          }

          customer = await this.customerDao.updateCustomer(manageCustomer, customerRepo);
        }

        // --- Delete customer ---
        else if (manageCustomer.isIsDelete()) {
          if (!manageCustomer.getCustomerId()) {
            throw new ValidationExceptionV2(
              CodesRes.notFoundException,
              "CustomerId not found",
              { code: ValidationType.CUSTOMER_ID_NOT_EXIST, type: ValidationStatus.WARNING, msgParams: null }
            );
          }

          const existingCustomer = await this.customerDao.findByCustomerId(manageCustomer.getCustomerId());
          if (!existingCustomer) {
            throw new ValidationExceptionV2(
              CodesRes.notFoundException,
              "Customer not found",
              { code: ValidationType.CUSTOMER_NOT_FOUND, type: ValidationStatus.WARNING, msgParams: null }
            );
          }

          await this.customerDao.removeCustomer(manageCustomer.getCustomerId(), customerRepo);
        }

        // --- Create new customer ---
        else if (manageCustomer.isIsNew()) {
          customer = await this.customerDao.createCustomer(manageCustomer, customerRepo);
        }

        // --- Invalid operation ---
        else {
          throw new ValidationExceptionV2(
            CodesRes.notFoundException,
            "Invalid customer operation",
            { code: ValidationType.INVALID_OPERATION, type: ValidationStatus.WARNING, msgParams: null }
          );
        }
      });

      cr.setStatus(true);
      if (customer) {
        cr.setExtra(this.customerResponse(customer));
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
  //---------------------CUSTOMER LIST------------------------------------

  async customerList(
    paginationRequest: CommonPaginationDto,
    userInfo: LoginUserInfo
  ): Promise<CommonResponse> {
    const cr: CommonResponse = new CommonResponse();
    try {
      if (userInfo.getRole() !== UserRole.STAFF) {
        throw new ValidationExceptionV2(
          CodesRes.validationError,
          "Invalid User",
          { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }
        );
      }

      const {list,count} = await this.customerDao.listCustomer(paginationRequest);
      cr.setStatus(true);
      cr.setExtra(list);
      cr.setCount(count);
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

  //--------------------------LOAD CUSTOMERS---------------------------
  async loadCustomer(
    loadRequest: loadRequestDTO,
    userInfo: LoginUserInfo
  ): Promise<CommonResponse> {
    const cr: CommonResponse = new CommonResponse();
    try {
      if (userInfo.getRole() !== UserRole.STAFF) {
        throw new ValidationExceptionV2(
          CodesRes.validationError,
          "Invalid User",
          { code: ValidationType.INVALID_USER, type: ValidationStatus.WARNING, msgParams: null }
        );
      }

      const customers = await this.customerDao.findCustomers(loadRequest);

      cr.setStatus(true);
      if (customers && customers.length>0) {
        const customerResponses=await Promise.all(
          customers.map(customer=>this.customerResponse(customer))
        )
        cr.setExtra(customerResponses);
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

  //--------------------------HELPER METHOD---------------------------
  private customerResponse(customer: Customer): CustomerResponseDTO {
    const customerData = new CustomerResponseDTO();
    customerData.setCustomerId(customer.customerId);
    customerData.setName(customer.name);
    customerData.setEmail(customer.email);
    customerData.setPhoneNumber(customer.phoneNumber);
    customerData.setAddress(customer.address);
    return customerData;
  }
}