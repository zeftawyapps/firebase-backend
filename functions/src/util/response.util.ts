import { ApiStatusCodeConst } from "../constant/utils-consts/api-status-code.const";
import { HttpStatusCodeConst } from "../constant/utils-consts/http-status-code.const";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { BaseException } from "../exception/base.exception";
import { AppLocale } from "./AppLocale";

export class ResponseUtil {
  static sendResponse(
    req: ExpressRequest,
    res: ExpressResponse,
    data: any,
    message?: string,
    apiStatusCode = ApiStatusCodeConst.SUCCESS,
    httpStatusCode = HttpStatusCodeConst.OK
  ) {
    const response: any = {
      data,
      status: apiStatusCode,
      message,
      devMessage: null,
    };
    if (!response.data) {
      response.data = {};
    }
    return res.status(httpStatusCode).json(response);
  }

  static sendException(
    req: ExpressRequest,
    res: ExpressResponse,
    exception: any
  ) {
    if (exception instanceof BaseException) {
      const response: any = {
        data: null,
        status: exception.apiStatusCode,
        devMessage: exception.stack,
      };
      if (exception.translateMessage) {
        response.message = AppLocale.translateBasedOnReqHeader(
          exception.message,
          req
        );
      }
      return res.status(exception.httpStatusCode).json(response);
    } else {
      return ResponseUtil.sendResponse(
        req,
        res,
        null,
        "Error in server",
        ApiStatusCodeConst.SERVER_ERROR,
        HttpStatusCodeConst.SERVER_ERROR
      );
    }
  }
}
