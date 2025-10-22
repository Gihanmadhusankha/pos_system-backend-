import { IValidation } from "../../../types/app-types";
import HttpException from "../http-exception";

export default class ServerException extends HttpException{
    stackInfo: any;

    constructor(errorCode: string, errorMessage: string, stack: any, validationObj: IValidation) {
      super(errorCode, errorMessage, validationObj);
      this.stackInfo = stack;
    }
}