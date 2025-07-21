import * as bodyParser from "body-parser";
import { Application, NextFunction, Request, Response } from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import dashboardV1Routes from "../route/v1/dashboard";
import express = require("express");
import { ResponseUtil } from "../util/response.util";
import { ApiStatusCodeConst } from "../constant/utils-consts/api-status-code.const";
import { HttpStatusCodeConst } from "../constant/utils-consts/http-status-code.const";
import appV1Routes from "../route/v1/app";

const cors = require("cors");
export const FirebaseApp = admin.initializeApp();
// 2- init express app.
export const dashboardExpress: Application = express();
export const appExpress: Application = express();

function expressInit(expressApp: Application) {
  expressApp.set("x-powered-by", false);
  expressApp.use(bodyParser.json());
  expressApp.use(cors());

  // handle all app errors.
  dashboardV1Routes(expressApp);
  appV1Routes(expressApp);
  expressApp.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
      functions.logger.error(err);
      return ResponseUtil.sendException(req, res, err);
    }
  );

  // handle all 404 errors.
  expressApp.use(function (req: Request, res: Response, next: NextFunction) {
    return ResponseUtil.sendResponse(
      req,
      res,
      null,
      "Not Found",
      ApiStatusCodeConst.NOT_FOUND,
      HttpStatusCodeConst.NOT_FOUND
    );
  });
}

expressInit(appExpress);
