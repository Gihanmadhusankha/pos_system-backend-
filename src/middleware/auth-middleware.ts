import express from "express";
import { LoginUserInfo } from "../dto/system/login-user";
import { JwtHelper } from "../support/jwt-helper";
import { TokenType } from "../enum/token-type";
import { UserDao } from "../dao/userDao";
import { UserDaoImpl } from "../dao/impl/userDaoImpl";
import { User } from "../entity/User";
/**
 * authentication middle ware
 */
let jwtHelper: JwtHelper = new JwtHelper();
let userDao: UserDao = new UserDaoImpl();

module.exports = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // check token and headers
  try {
    // check authorization
    if (req.headers.authorization) {

      let token = req.headers.authorization.split(" ")[1];

      if(token){

        // verify token
        let decoded: any = jwtHelper.verifyJwt(token, TokenType.AUTH);
  
        let email = decoded['email'];

        let loginUser: User = await userDao.findByEmail(email);
  
        let loginUserInfo: LoginUserInfo = new LoginUserInfo();
          loginUserInfo.fillViaObject(loginUser);
          loginUserInfo.setUserId(loginUser.userId);
          loginUserInfo.setRole(loginUser.role);
          loginUserInfo.setJwtToken(token);
        
        req.body.loginUserInfoJWT = loginUserInfo;
  
        next();
                        
      }else{
        res.sendStatus(401);
      }

    }else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
  }
};

