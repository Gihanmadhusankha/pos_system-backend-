import HttpException from "../../services/exception/http-exception";
import { IValidation } from "../../types/app-types";

export class CommonResponse {
  // failed or success
  private status: Boolean = false;
  // response code
  private code: String = "";
  // data object or error msg
  private extra: Object = "";

  private count: number = 0;

  private error: HttpException;

  private validation: IValidation;

  public getError(): HttpException {
    return this.error;
  }

  public setError(error: HttpException): void {
    this.error = error;
  }

  public getCount(): number {
    return this.count;
  }

  public setCount(count: number): void {
    this.count = count;
  }

  public isStatus(): Boolean {
    return this.status;
  }

  public setStatus(status: Boolean): void {
    this.status = status;
  }

  public getCode(): String {
    return this.code;
  }

  public setCode(code: String): void {
    this.code = code;
  }

  public getExtra(): Object {
    return this.extra;
  }

  public setExtra(extra: Object): void {
    this.extra = extra;
  }

  public getValidation(): IValidation {
    return this.validation;
  }

  public setValidation(value: IValidation): void {
    this.validation = value;
  }

}
