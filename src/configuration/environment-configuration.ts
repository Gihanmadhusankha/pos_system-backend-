import config from "config";
import { AppConfigurationsDto } from "../common/dto/app-configuration-dto";

export class EnvironmentConfiguration {
  readAppConfiguration(): AppConfigurationsDto {
    let appConfig: AppConfigurationsDto = new AppConfigurationsDto();

    appConfig.setIp(process.env.server_ip || config.get("server.ip"));
    let port: any = process.env.server_port;
    appConfig.setPort(port || config.get("server.port"));
    appConfig.setDataBase(process.env.db_name || config.get("db.db"));
    appConfig.setHost(process.env.db_host || config.get("db.host"));
    appConfig.setPassword(process.env.db_password || config.get("db.password"));
    let dataBasePort: any = process.env.db_port;
    appConfig.setDataBasePort(dataBasePort || config.get("db.port"));
    appConfig.setUserName(process.env.db_user_name || config.get("db.userName"));
    appConfig.setJwtSecret(process.env.jwtSecret || config.get("jwtSecret"));
    appConfig.setJwtExpireTime(process.env.jwtExpireTime || config.get("jwtExpireTime"));
    appConfig.setRefreshSecret(process.env.refreshSecret || config.get("refreshSecret"));
    appConfig.setRefreshExpireTime(process.env.refreshExpireTime || config.get("refreshExpireTime"));

    return appConfig;
  }
}
