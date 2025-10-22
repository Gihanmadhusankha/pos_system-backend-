import jwt from "jsonwebtoken";
import { EnvironmentConfiguration } from "../configuration/environment-configuration";
import { LoginUserInfo } from "../dto/system/login-user";
import { TokenType } from "../enum/token-type";

let environmentConfiguration: EnvironmentConfiguration = new EnvironmentConfiguration();
let appConfiguration = environmentConfiguration.readAppConfiguration();
/**
 * help to build jwt token
 */
export class JwtHelper {
    /**
     * create jwt for login user
     * @param loginUserInfo
     */
    generateJwt(loginUserInfo: LoginUserInfo, tokenType: TokenType): any {
        let userObj: { userId: number; email: string;  } = {
            userId: loginUserInfo.getUserId(),
            email: loginUserInfo.getEmail(),
        };

        let tokenExpire: any = null;
        if (tokenType === TokenType.AUTH) {
            tokenExpire = appConfiguration.getJwtExpireTime() ? appConfiguration.getJwtExpireTime() : '30m';
        } else if (tokenType === TokenType.REFRESH) {
            tokenExpire = appConfiguration.getRefreshExpireTime() ? appConfiguration.getRefreshExpireTime() : '10d';
        }

        return jwt.sign(userObj, tokenType === TokenType.AUTH ? appConfiguration.getJwtSecret() : appConfiguration.getRefreshSecret(), { expiresIn: tokenExpire });
    }

    /**
     * verify jwt token
     *
     * @param {any} jwtToken
     * @return {any} loginUserInfo , if error occur then return exception
     */
    verifyJwt(jwtToken: any, tokenType: TokenType): any {

        const key = jwt.verify(
            jwtToken,
            tokenType === TokenType.AUTH ? appConfiguration.getJwtSecret() : appConfiguration.getRefreshSecret(),
        );

        return key;
    }
}