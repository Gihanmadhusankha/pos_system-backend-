import { CommonResponse } from "../dto/common-response";

export class Utility {
    /**
     * get success common response
     * @param extra 
     * @param code
     * @returns common response 
     */
  public static getSuccessResponse(
    extra: Object,
    code: String
  ): CommonResponse {
    let commonResponse: CommonResponse = new CommonResponse();
    commonResponse.setStatus(true);
    commonResponse.setExtra(extra);
    commonResponse.setCode(code);
    return commonResponse;
  }

  /**
   * get failed common response
   * @param extra 
   * @param code 
   * @returns common response
   */
  public static getErrorResponse(
    extra: Object,
    code: String
  ): CommonResponse {
    let commonResponse: CommonResponse = new CommonResponse();
    commonResponse.setStatus(false);
    commonResponse.setExtra(extra);
    commonResponse.setCode(code);
    return commonResponse;
  }

}
