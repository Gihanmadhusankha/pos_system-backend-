import { IValidation } from "../../types/app-types";

export default abstract class HttpException extends Error {
  errorCode: string;
  errorMessage: string;
  exception: any;
  validationCode: string;
  validationType: string;
  validationMsgParams: string[];

  constructor(errorCode: string, errorMessage: string, validationObj: IValidation) {
    super();
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.validationCode = validationObj.code;
    this.validationType = validationObj.type;
    this.validationMsgParams = validationObj.msgParams;
  }
}