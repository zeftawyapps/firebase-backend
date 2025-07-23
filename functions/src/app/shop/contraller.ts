import { NextFunction, Response } from "express";
import { ResponseUtil } from "../../util/response.util";

import { AppUtil } from "../../util/app.util";
import { ShopService } from "./service";
import { shopValidation } from "./validation";

export class ShopController {
  service: ShopService;
  constructor() {
    this.service = new ShopService();
  }

  // Create shop profile
  async createShop(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      const body = AppUtil.validate(data, shopValidation.createShop);
      await this.service.createShop(uid, body);
      ResponseUtil.sendResponse(req, res, "Shop created successfully");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // Update shop information
  async updateShop(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      const body = AppUtil.validate(data, shopValidation.updateShop);
      await this.service.updateShop(uid, body);
      ResponseUtil.sendResponse(req, res, "Shop updated successfully");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // Get shop profile
  async getShopProfile(req: any, res: Response, next: NextFunction) {
    try {
      const uid = req.user.userId;
      const shop = await this.service.getShopProfile(uid);
      ResponseUtil.sendResponse(req, res, shop);
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // Get shop by ID (public)
  async getShopById(req: any, res: Response, next: NextFunction) {
    try {
      const { shopId } = req.params;
      const shop = await this.service.getShopById(shopId);
      ResponseUtil.sendResponse(req, res, shop);
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // Get nearby shops
  // async getNearbyShops(req: any, res: Response, next: NextFunction) {
  //   try {
  //     const { latitude, longitude, radius } = req.query;
  //     const location = {
  //       latitude: parseFloat(latitude),
  //       longitude: parseFloat(longitude),
  //     };
  //     const shops = await this.service.getNearbyShops(
  //       location,
  //       parseInt(radius) || 10
  //     );
  //     ResponseUtil.sendResponse(req, res, shops);
  //   } catch (e) {
  //     ResponseUtil.sendException(req, res, e);
  //     next(e);
  //   }
  // }

  // Get all active shops
  async getAllActiveShops(req: any, res: Response, next: NextFunction) {
    try {
      const shops = await this.service.getAllActiveShops();
      ResponseUtil.sendResponse(req, res, shops);
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // Toggle shop active status
  async toggleShopStatus(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      const body = AppUtil.validate(data, shopValidation.toggleStatus);
      await this.service.toggleShopStatus(uid, body.isActive);
      ResponseUtil.sendResponse(req, res, "Shop status updated successfully");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // Update shop location
  async updateShopLocation(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      const body = AppUtil.validate(data, shopValidation.updateLocation);
      await this.service.updateShopLocation(uid, body.location, body.address);
      ResponseUtil.sendResponse(req, res, "Shop location updated successfully");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }
}
