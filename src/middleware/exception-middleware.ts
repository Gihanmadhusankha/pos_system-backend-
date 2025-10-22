import { NextFunction, Request, Response } from "express";

import { CommonResponse } from "../common/dto/common-response";
import Logger from "../configuration/log-configuration";
import ServerException from "../services/exception/exception-impl/server-exception";
import ValidationException from "../services/exception/exception-impl/validation-exception";
import HttpException from "../services/exception/http-exception";
import { CodesRes } from "../support/codes-sup";
import { ValidationType } from "../enum/validation-type";
import { ValidationStatus } from "../enum/validation-status";
import { IValidation } from "../types/app-types";

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {

  let cr: CommonResponse = new CommonResponse();
  let httpException: HttpException;
  
  if (error instanceof ValidationException) {
    cr.setExtra(error.errorMessage);
    cr.setCode(error.errorCode);
    httpException = error;
  } else {
    let exception = error.stack;
    let nullValidationObj: IValidation = { code: null, type: null, msgParams: null };
    httpException = new ServerException(CodesRes.tryCatchException, error.message ? error.message : error.errorMessage, exception, nullValidationObj);
    console.log(error);

    cr.setExtra("Server Side Exception");
    cr.setCode(CodesRes.tryCatchException);
    cr.setValidation({ code: ValidationType.SRV_SIDE_EXC, type: ValidationStatus.ERROR, msgParams: null });
  }
  cr.setError(httpException);

  Logger.error(JSON.stringify(httpException));


  response.send(cr);
}

export default errorMiddleware;