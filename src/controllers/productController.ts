import express, { NextFunction } from "express";
import { CommonResponse } from "../common/dto/common-response";
import { ManagaProductRequest } from "../dto/product-dtos/manageProduct-dto";
import { CommonPaginationDto } from "../dto/commonPagination-dto";
import { ProductService } from "../services/product-service/ProductService";
import { ProductServiceImpl } from "../services/product-service/Impl/ProductServiceImpl";
import { LoginUserInfo } from "../dto/system/login-user";
import { LoginUserInfoSup } from "../support/login-user-info-sup";
import { SearchDto } from "../dto/search-dto";
import { loadRequestDTO } from "../dto/loadRequest-dto";


const productService: ProductService = new ProductServiceImpl();

//----------------MANAGE PRODUCTS---------------------------------

exports.manageProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {

    let userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
    let manageProductRequest: ManagaProductRequest = new ManagaProductRequest();
    manageProductRequest.fillViaRequest(req.body);
    let response: CommonResponse = await productService.manageProduct(userInfo, manageProductRequest);

    res.send(response);

  } catch (err) {
    next(err);
  }
}


//-----------------------PRODUCT LIST--------------------------------

exports.productList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

  try {

    let userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
    let paginationRequest: CommonPaginationDto = new CommonPaginationDto();
    paginationRequest.fillViaRequest(req.body);
    const response: CommonResponse = await productService.productList(userInfo, paginationRequest);


    res.send(response);

  } catch (err) {
    next(err);
  }
}

  //-------------------------LOAD PRODUCTS-----------------------------
 exports.loadProduct=async(req:express.Request,res:express.Response,next:NextFunction)=>{
   try{
       let userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
  
       let loadRequest:loadRequestDTO=new  loadRequestDTO();
       loadRequest.fillViaRequest(req.body);
       
       const response:CommonResponse=await productService.loadProduct(loadRequest);
       res.send(response);
  
    } catch (err) {
      next(err);
    }
  }
  
  //--------------------STOCK LIST----------------------------------
  exports.stockList=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try{
      let userInfo:LoginUserInfo=LoginUserInfoSup.getLoginUserInfoFromReq(req);
      let paginationRequest:CommonPaginationDto=new CommonPaginationDto();
      paginationRequest.fillViaRequest(req.body);
      const response:CommonResponse=await productService.stockList(userInfo,paginationRequest);
    
     res.send(response);

  } catch (err) {
    next(err);
  }

}


