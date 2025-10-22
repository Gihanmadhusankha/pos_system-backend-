import { CommonResponse } from "../../common/dto/common-response";

export interface SystemService{
  systemHealth(): Promise<CommonResponse>;
}
