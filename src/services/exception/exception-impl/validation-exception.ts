import HttpException from "../http-exception";

export default class ValidationException extends HttpException {
  stackInfo: any;

  constructor(errorCode: string, errorMessage: string) {
    super(errorCode, errorMessage, {code: null, type: null, msgParams: null});
    this.stackInfo = this.stack;
  }
}