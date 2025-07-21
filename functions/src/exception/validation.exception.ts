import { BaseException } from "./base.exception";
import { ApiStatusCodeConst } from "../constant/utils-consts/api-status-code.const";
import { HttpStatusCodeConst } from "../constant/utils-consts/http-status-code.const";

export class ValidationException extends BaseException {
  constructor(message: string, devMessage: string, translateMessage = false) {
    super(
      message,
      ApiStatusCodeConst.VALIDATION_ERROR,
      HttpStatusCodeConst.PRE_CONDITION_FAILED,
      devMessage,
      translateMessage
    );
  }
}
