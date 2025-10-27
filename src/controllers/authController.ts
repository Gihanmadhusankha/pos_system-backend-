import express from "express";
import { CommonResponse } from "../common/dto/common-response";
import { RegisterRequestDto } from "../dto/user-dtos/register-dto";
import { LoginRequestDto } from "../dto/user-dtos/login-dto";
import { AuthService } from "../services/user-service/AuthService";
import { AuthServiceImpl } from "../services/user-service/Impl/AuthServiceImpl";
import { TokenType } from "../enum/token-type";
import { JwtHelper } from "../support/jwt-helper";
import { LoginUserInfo } from "../dto/system/login-user";
import { User } from "../entity/User";
import { UserDao } from "../dao/userDao";
import { UserDaoImpl } from "../dao/impl/userDaoImpl";


const authService: AuthService = new AuthServiceImpl();
let jwtHelper: JwtHelper = new JwtHelper();
let userDao: UserDao = new UserDaoImpl();

//--------------------USER REGISTER---------------------------------

exports.register = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    let registerRequestDto: RegisterRequestDto = new RegisterRequestDto();
    registerRequestDto.fillViaRequest(req.body);

    let response: CommonResponse = await authService.register(registerRequestDto);
    res.send(response);
  } catch (err) {
    next(err);
  }
};


//-----------------USER LOGIN--------------------------------------------

exports.login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // let userInfo: LoginUserInfo = LoginUserInfoSup.getLoginUserInfoFromReq(req);
    let loginRequestDto: LoginRequestDto = new LoginRequestDto();
    loginRequestDto.fillViaRequest(req.body);

    let response: CommonResponse = await authService.login(loginRequestDto);
    res.send(response);
  } catch (err) {
    next(err);
  }
};

//----------------------------REFRESH TOKEN-----------------------------------

exports.refresh = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // check authorization
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];

      if (token) {

        // verify token
        let decoded: any = jwtHelper.verifyJwt(token, TokenType.REFRESH);

        let email = decoded['email'];

        const loginUser: User = await userDao.findByEmail(email);

        let loginUserInfo: LoginUserInfo = new LoginUserInfo();
        loginUserInfo.fillViaObject(loginUser);

        let access_token = jwtHelper.generateJwt(loginUserInfo, TokenType.AUTH);
        let refresh_token = jwtHelper.generateJwt(loginUserInfo, TokenType.REFRESH);

        loginUserInfo.setJwtToken(access_token);
        loginUserInfo.setRefreshToken(refresh_token);

        res.status(200).send(loginUserInfo);

      } else {
        res.sendStatus(401);
      }

    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
  }



  
};




