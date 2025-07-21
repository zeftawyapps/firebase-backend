import { NextFunction, Request, Response } from "express";
import { AppUtil } from "../../../util/app.util";
import { debValidation } from "./validation";
import { CatService as CatService } from "./service";
import { ResponseUtil } from "../../../util/response.util";

export class CategoryController {
  private service: CatService;
  constructor() {
    this.service = new CatService();
  }

  // CRUD methods
  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const cate = await this.service.getcats();
      ResponseUtil.sendResponse(req, res, cate);
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }
  async insertCatigory(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, debValidation.data);

      await this.service.inset(data);
      ResponseUtil.sendResponse(req, res, {});
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const catId = req.params.id;

      const data = AppUtil.validate(body, debValidation.data);

      await this.service.update(catId, data);

      ResponseUtil.sendResponse(req, res, {});
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const catId = req.params.id;

      await this.service.delete(catId);

      ResponseUtil.sendResponse(req, res, {});
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  async changeSorting(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyInvalidate = req.body;

      const body = AppUtil.validate(bodyInvalidate, debValidation.sort);
      const sort = body.sort;
      const catId = body.catId;

      await this.service.setcatSort(sort, catId);
      ResponseUtil.sendResponse(req, res, "Done");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  async createCat(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyInvalidate = req.body;

      const body = AppUtil.validate(bodyInvalidate, debValidation.data);

      const catName = body.catName;

      await this.service.createcatDoc(catName);
      ResponseUtil.sendResponse(req, res, "Done");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }
}
