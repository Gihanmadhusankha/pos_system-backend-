import express from "express";
import { LoginUserInfo } from "../dto/system/login-user";
export class LoginUserInfoSup {
  static getLoginUserInfoFromReq(req: express.Request): LoginUserInfo {
    let loginUserDto: LoginUserInfo = new LoginUserInfo();
    loginUserDto.fillViaObject(req.body.loginUserInfoJWT)
    return loginUserDto;
  }
}
