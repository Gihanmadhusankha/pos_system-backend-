import { CommonResponse } from "../../common/dto/common-response";
import { CommonPaginationDto } from "../../dto/commonPagination-dto";
import { CreateOrderDTO } from "../../dto/order-dto/createOrder-dto";
import { LoginUserInfo } from "../../dto/system/login-user";



export interface OrderService{
    createOrder(userInfo:LoginUserInfo,createOrderRequest:CreateOrderDTO,):Promise<CommonResponse>;
    getOrderById(userInfo:LoginUserInfo,orderId:number):Promise<CommonResponse>;
    orderList(userInfo:LoginUserInfo,paginationDto:CommonPaginationDto):Promise<CommonResponse>;
    paidOrder(userInfo:LoginUserInfo,orderId:number):Promise<CommonResponse>;
    cancelOrder(userInfo:LoginUserInfo,orderId:number):Promise<CommonResponse>;
}