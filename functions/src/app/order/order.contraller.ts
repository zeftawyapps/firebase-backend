import { NextFunction } from "express";
import { ResponseUtil } from "../../util/response.util";
import { OrderService } from "./order.service";
import { AppUtil } from "../../util/app.util";
import { OrderValidation } from "./validation";

export class OrderController {
  //
  private service: OrderService;
  constructor() {
    this.service = new OrderService();
  }
  async createOrder(req: any, res: any, next: NextFunction) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, OrderValidation.insert);

      const result = await this.service.createOrder(data);
      if (result == "done") {
        ResponseUtil.sendResponse(req, res, result);
      }

      ResponseUtil.sendException(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }
  async updateOrder(req: any, res: any, next: NextFunction) {
    try {
      const id = req.params.id;
      const body = req.body;
      const data = AppUtil.validate(body, OrderValidation.update);

      const result = await this.service.updateOrder(id, data);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }
  async deleteOrder(req: any, res: any, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await this.service.deleteOrder(id);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }
  async getOrders(req: any, res: any, next: NextFunction) {
    try {
      const result = await this.service.getOrders();
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }
  async getSingleOrder(req: any, res: any, next: NextFunction) {
    try {
      const result = await this.service.getSingleOrder();
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }
}
