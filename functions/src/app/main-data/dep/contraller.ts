import { NextFunction, Request, Response } from "express";
import { AppUtil } from "../../../util/app.util";
import { debValidation } from "./validation";
import { DepService } from "./service";
import { ResponseUtil } from "../../../util/response.util";

export class DepController {
  srevice: DepService;
  constructor() {
    this.srevice = new DepService();
  }
  async changeSorting(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyInvalidate = req.body;

      const body = AppUtil.validate(bodyInvalidate, debValidation.sort);
      const sort = body.sort;
      const depId = body.depId;

      await this.srevice.setDepSort(sort, depId);
      ResponseUtil.sendResponse(req, res, "Done");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }
  async setMony(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyInvalidate = req.body;

      const body = AppUtil.validate(bodyInvalidate, debValidation.mony);
      const mony = body.mony;
      const depId = body.depId;

      await this.srevice.setDepMony(mony, depId);
      ResponseUtil.sendResponse(req, res, "Done");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  async createDep(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyInvalidate = req.body;

      const body = AppUtil.validate(bodyInvalidate, debValidation.create);

      const depName = body.depName;

      await this.srevice.createDepDoc(depName);
      ResponseUtil.sendResponse(req, res, "Done");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }
  async publishDep(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyInvalidate = req.body;

      const body = AppUtil.validate(bodyInvalidate, debValidation.publish);

      const isPublish = body.isPublish;
      const depId = body.depId;

      await this.srevice.setDepPublish(isPublish, depId);
      ResponseUtil.sendResponse(req, res, "Done");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  async resortDeps(req: Request, res: Response, next: NextFunction) {
    try {
      await this.srevice.resortDeps();
      ResponseUtil.sendResponse(req, res, "Done");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }
}
