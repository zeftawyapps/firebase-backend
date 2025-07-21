import { NextFunction } from "express";
import { Request as ExpressRequest } from "express";
import { ProductsService } from "./service";
import { ResponseUtil } from "../../../util/response.util";
import { Response as ExpressResponse } from "express";
import { prodValidation } from "./validation";
import { AppUtil } from "../../../util/app.util";

export class ProductController {
  srevice: ProductsService;
  constructor() {
    this.srevice = new ProductsService();
  }

  async getProduct(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    try {
      const docId = req.query.depId;
      // add validation

      const quiez = await this.srevice.getProduct(docId);
      ResponseUtil.sendResponse(req, res, quiez);
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // add crud operations
  async createProduct(req: ExpressRequest, res: ExpressResponse) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, prodValidation.insert);
      const catId = req.params.catId ?? "";
      const quiez = await this.srevice.createProduct(catId.toString(), data);
      ResponseUtil.sendResponse(req, res, quiez);
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
    }
  }

  async updateProduct(req: ExpressRequest, res: ExpressResponse) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, prodValidation.updateProduct);
      const catId = req.params.catId ?? "";
      const prodId = req.params.prodId ?? "";
      await this.srevice.updateProduct(
        catId.toString(),
        prodId.toString(),
        data
      );
      ResponseUtil.sendResponse(req, res, "Updated");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
    }
  }
  // add delete operation
  async deleteProduct(req: ExpressRequest, res: ExpressResponse) {
    try {
      const catId = req.params.catId ?? "";
      const prodId = req.params.prodId ?? "";
      await this.srevice.deleteProduct(catId.toString(), prodId.toString());
      ResponseUtil.sendResponse(req, res, "Deleted");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
    }
  }
}
