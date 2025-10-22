import { IValidation } from "../../../types/app-types";
import HttpException from "../http-exception";

export default class ValidationExceptionV2 extends HttpException {
  stackInfo: any;

  constructor(errorCode: string, errorMessage: string, validationObj: IValidation) {
    super(errorCode, errorMessage, {code: validationObj.code, type: validationObj.type, msgParams: validationObj.msgParams});
    this.stackInfo = this.stack;
  }
}