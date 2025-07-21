import { BaseException } from "./base.exception";
import { ApiStatusCodeConst } from "../constant/utils-consts/api-status-code.const";
import { HttpStatusCodeConst } from "../constant/utils-consts/http-status-code.const";

export class EmailNotVerifiedException extends BaseException {
  constructor(message: string, devMessage = "", translateMessage = true) {
    super(
      message,
      ApiStatusCodeConst.EMAIL_NOT_VERIFIED,
      HttpStatusCodeConst.BAD_REQUEST,
      devMessage,
      translateMessage
    );
  }
}
