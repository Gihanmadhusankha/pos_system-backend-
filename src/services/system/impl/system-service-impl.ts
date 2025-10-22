import { Utility } from "../../../common/class/Utility";
import { CommonResponse } from "../../../common/dto/common-response";
import { SystemService } from "../system-service";
/**
 * this class for identify system is running or not
 */
export class SystemServiceImpl implements SystemService {
  /**
   * will return system is up or not
   * @author
   * @returns common response object
   *
   */
  async systemHealth(): Promise<CommonResponse> {
    return Utility.getSuccessResponse("System is Up And Running",null);
  }
}
