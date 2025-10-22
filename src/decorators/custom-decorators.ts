import config from "config";
import express, { Request, Response, Router } from "express";
import * as http from "http";
import { AppConfigurationsDto } from "../common/dto/app-configuration-dto";
import { EnvironmentConfiguration } from "../configuration/environment-configuration";
import morganMiddleware from "../configuration/http-log-configuration";
import cors from "cors";
import { RouteConfiguration } from "../configuration/route-configuration";
import { ConnectToDatabase } from "../configuration/database-configuration";
import errorHandlerMiddleware from "../middleware/exception-middleware";

/**
 * main application configuration
 * set up db , loggers , cors and etc
 * @param constructor 
 */
export function NodeApplication<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  const app = express();
  app.use(morganMiddleware);
  app.use(cors());
  app.use(express.json({limit:'50mb'}));
  // config routes
  getRoutes(app);

  const server: http.Server = http.createServer(app);

  // configuration read from system environment
  let appConfigurationDto: AppConfigurationsDto = readAppConfiguration();
  const port: Number = appConfigurationDto.getPort();

  // error handler middleware
  app.use(errorHandlerMiddleware);

  // connect to data base
  ConnectToDatabase();

  // start server
  app.listen(port);
  // call prototype method
  constructor.prototype.run(port);
}

export function getRoutes(app: express.Application) {
      let routeConfiguration:RouteConfiguration = new RouteConfiguration();
      routeConfiguration.configRoutes(app);
}

export function readAppConfiguration(): AppConfigurationsDto {
  let configurationReader: EnvironmentConfiguration = new EnvironmentConfiguration();
  let appConfigurationDto: AppConfigurationsDto = configurationReader.readAppConfiguration();
  return appConfigurationDto;
}
