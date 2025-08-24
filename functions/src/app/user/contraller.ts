import { NextFunction, Response } from "express";
import { ProfileService } from "./service";
import { ResponseUtil } from "../../util/response.util";
import { gameResultValidation, userValidation } from "./validation";
import { AppUtil } from "../../util/app.util";
import * as admin from "firebase-admin";
import { User } from "./model";

export class UserController {
  service: ProfileService;
  constructor() {
    this.service = new ProfileService();
  }

  async setProfileDepGameResult(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      const body = AppUtil.validate(data, gameResultValidation.gameResult);
      await this.service.setProfile(uid, body);
      ResponseUtil.sendResponse(req, res, "Done");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  async setProfileMony(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      const body = AppUtil.validate(data, gameResultValidation.addMony);
      const mony = body.mony;
      await this.service.setMony(uid, mony);
      ResponseUtil.sendResponse(req, res, "Done");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // // Create account (register)
  // async createAccount(req: any, res: Response, next: NextFunction) {
  //   try {
  //     const data = req.body;

  //     const result = await this.service.createAccount(data);
  //     ResponseUtil.sendResponse(req, res, result);
  //   } catch (e) {
  //     ResponseUtil.sendException(req, res, e);
  //     next(e);
  //   }
  // }

  // Login

  // Create profile
  async createAccount(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const validateData = AppUtil.validate(data, userValidation.createAccount);
      const password = validateData.password;
      const userRecord = await admin.auth().createUser({
        email: validateData.email,
        password: password,
      });
      const userId = userRecord.uid;

      const userData = new User({
        uid: userId,
        email: validateData.email,
        name: validateData.name,
        phone: validateData.phone,
        role: validateData.role,
      });

      const result = await this.service.createAccount(userData.toJson());
      ResponseUtil.sendResponse(req, res, result);
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }
}
