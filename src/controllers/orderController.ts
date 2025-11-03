import express, { Request, Response, NextFunction } from "express";
import { UserRole } from "../enum/userRole";
import { CommonResponse } from "../common/dto/common-response";
import { LoginUserInfoSup } from "../support/login-user-info-sup";
import { LoginUserInfo } from "../dto/system/login-user";
import ValidationExceptionV2 from "../services/exception/exception-impl/validation-exception-v2";
import { CodesRes } from "../support/codes-sup";
import { ValidationType } from "../enum/validation-type";
import { ValidationStatus } from "../enum/validation-status";
import { OrderService } from "../services/order-service/OrderService";
import { OrderServiceImpl } from "../services/order-service/Impl/OrderServiceImpl";
import { CreateOrderDTO } from "../dto/order-dto/createOrder-dto";
import { CommonPaginationDto } from "../dto/commonPagination-dto";
import { orderRequest } from "../dto/order-dto/OrderRequestId-dto";
import { loadRequestDTO } from "../dto/loadRequest-dto";

const orderService: OrderService = new OrderServiceImpl();

// ------------------- CREATE ORDER -------------------

exports.createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);

    const createOrderRequest = new CreateOrderDTO();
    createOrderRequest.fillViaRequest(req.body);

    const response: CommonResponse = await orderService.createOrder(userInfo, createOrderRequest);
    res.send(response);
  } catch (err) {
    next(err);
  }
};

// ------------------- GET ORDER BY ID -------------------

exports.getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
    const orderRequestId = new orderRequest();
    orderRequestId.fillViaRequest(req.body);

    const response: CommonResponse = await orderService.getOrderById(userInfo, orderRequestId.getOrderId());
    res.send(response);
  } catch (err) {
    next(err);
  }
};

// ------------------- GET ORDER LIST -------------------
exports.getOrderList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
    const paginationRequest = new CommonPaginationDto();
    paginationRequest.fillViaRequest(req.body);

    const response: CommonResponse = await orderService.orderList(userInfo, paginationRequest);
    res.send(response);
  } catch (err) {
    next(err);
  }
};

// ------------------- PAID ORDER -------------------

exports.paidOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
    const orderRequestId = new orderRequest();
    orderRequestId.fillViaRequest(req.body);

    const response: CommonResponse = await orderService.paidOrder(userInfo, orderRequestId.getOrderId());
    res.send(response);
  } catch (err) {
    next(err);
  }
};

// ------------------- CANCEL ORDER -------------------

exports.cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
    const orderRequestId = new orderRequest();
    orderRequestId.fillViaRequest(req.body);

    const response: CommonResponse = await orderService.cancelOrder(userInfo, orderRequestId.getOrderId());
    res.send(response);
  } catch (err) {
    next(err);
  }
};
//-------------------------LOAD ORDERS-----------------------------
 exports.loadOrder=async(req:express.Request,res:express.Response,next:NextFunction)=>{
   try{
       let userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
  
       let loadRequest:loadRequestDTO=new  loadRequestDTO();
       const response:CommonResponse=await orderService.loadOrder(loadRequest,userInfo);
       res.send(response);
  
    } catch (err) {
      next(err);
    }
  }
