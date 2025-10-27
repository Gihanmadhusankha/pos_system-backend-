import express from "express";
import { CommonResponse } from "../common/dto/common-response";
import { SearchDto } from "../dto/search-dto";
import { LoginUserInfo } from "../dto/system/login-user";
import { LoginUserInfoSup } from "../support/login-user-info-sup";
import { ManageStaffRequest } from "../dto/user-dtos/manageStaff-dto";
import { StaffService } from "../services/staff-service/StaffService";
import { StaffServiceImpl } from "../services/staff-service/Impl/StaffServiceImpl";


const staffService: StaffService = new StaffServiceImpl();





//-----------------------STAFF REGISTER----------------------------------------

exports.manageStaff = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
         let userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
        let manageStaffDto: ManageStaffRequest = new ManageStaffRequest();
        manageStaffDto.fillViaRequest(req.body);

        let response: CommonResponse = await staffService.manage(userInfo,manageStaffDto);
        res.send(response);
    } catch (err) {
        next(err);
    }
};

//-----------------------STAFF LIST--------------------------------



exports.staffList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {

        let userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
        let paginationRequest:SearchDto = new SearchDto();
        paginationRequest.SearchfillViaRequest(req.body);
        const response: CommonResponse = await staffService.staffList(userInfo, paginationRequest);


        res.send(response);

    } catch (err) {
        next(err);
    }
}