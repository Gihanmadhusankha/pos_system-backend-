import express, { NextFunction } from "express";
import { CustomerService } from "../services/customer-service/CustomerService";
import { ManageCustomerRequest } from "../dto/customer-dto/manageCustomerRequest-dto";
import { CommonResponse } from "../common/dto/common-response";
import { CommonPaginationDto } from "../dto/commonPagination-dto";
import { CustomerServiceImpl } from "../services/customer-service/Impl/CustomerServiceImpl";
import { LoginUserInfo } from "../dto/system/login-user";
import { LoginUserInfoSup } from "../support/login-user-info-sup";
import { loadRequestDTO } from "../dto/loadRequest-dto";


const customerService: CustomerService = new CustomerServiceImpl();

//-------------------------MANAGE CUSTOMERS----------------------------

exports.manageCustomer = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    let userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);

    let manageCustomerRequest: ManageCustomerRequest = new ManageCustomerRequest();
    manageCustomerRequest.fillViaRequest(req.body);
    let response: CommonResponse = await customerService.manageCustomer(manageCustomerRequest, userInfo);
    res.send(response);

  } catch (err) {
    next(err);

  }

}

//-----------------------CUSTOMER LIST--------------------------------

exports.customerList = async (req: express.Request, res: express.Response, next: NextFunction) => {
  try {
    let userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);

    let paginationRequest: CommonPaginationDto = new CommonPaginationDto();
    paginationRequest.fillViaRequest(req.body);
    const response: CommonResponse = await customerService.customerList(paginationRequest, userInfo);
    res.send(response);

  } catch (err) {
    next(err);
  }
}
  //-------------------LOAD CUSTOMERS------------------------------
  exports.loadCustomer = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try{
     let userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);

     let loadRequest:loadRequestDTO=new  loadRequestDTO();
     loadRequest.fillViaRequest(req.body);
     
     const response:CommonResponse=await customerService.loadCustomer(loadRequest,userInfo)
     res.send(response);

  } catch (err) {
    next(err);
  }
}

