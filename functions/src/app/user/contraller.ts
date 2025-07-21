import { NextFunction, Response } from "express";
import { ProfileService } from "./service";
import { ResponseUtil } from "../../util/response.util";
import { gameResultValidation } from "./validation";
import { AppUtil } from "../../util/app.util";

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
}
