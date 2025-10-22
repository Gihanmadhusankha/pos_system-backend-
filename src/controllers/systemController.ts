import express from "express";
import { CommonResponse } from "../common/dto/common-response";
import Logger from "../configuration/log-configuration";
import { SystemServiceImpl } from "../services/system/impl/system-service-impl";
import { SystemService } from "../services/system/system-service";

/**
 * handle system http request
 */

let systemService: SystemService = new SystemServiceImpl();

/**
 * verify is system running
 * @returns if system can handle request then will return "system is up" string
 */
exports.getSystemHealth = async (
  req: express.Request,
  res: express.Response
) => {
  let response: CommonResponse = await systemService.systemHealth();
  Logger.info(response.getExtra());
  res.send(response);
};
