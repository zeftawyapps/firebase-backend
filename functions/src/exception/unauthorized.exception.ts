import { BaseException } from "./base.exception";
import { ApiStatusCodeConst } from "../constant/utils-consts/api-status-code.const";
import { HttpStatusCodeConst } from "../constant/utils-consts/http-status-code.const";

export class UnauthorizedException extends BaseException {
  constructor(message: string, devMessage = "", translateMessage = true) {
    super(
      message,
      ApiStatusCodeConst.UN_AUTHORIZED,
      HttpStatusCodeConst.UNAUTHORIZED,
      devMessage,
      translateMessage
    );
  }
}
