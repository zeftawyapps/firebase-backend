import { NextFunction, Response } from "express";
import { ResponseUtil } from "../../util/response.util";

import { AppUtil } from "../../util/app.util";
import { ShopService } from "./service";
import { shopValidation } from "./validation";

/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: Shop management endpoints
 */
export class ShopController {
  service: ShopService;
  constructor() {
    this.service = new ShopService();
  }

  /**
   * @swagger
   * /shop:
   *   post:
   *     summary: Create a new shop
   *     tags: [Shop]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               location:
   *                 $ref: '#/components/schemas/Location'
   *               address:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       200:
   *         description: Shop created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request
   */
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

  /**
   * @swagger
   * /shop:
   *   put:
   *     summary: Update shop information
   *     tags: [Shop]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               address:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       200:
   *         description: Shop updated successfully
   *       401:
   *         description: Unauthorized
   */
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

  /**
   * @swagger
   * /shop/profile:
   *   get:
   *     summary: Get current user's shop profile
   *     tags: [Shop]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Shop profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Shop'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Shop not found
   */
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

  /**
   * @swagger
   * /shop/{shopId}:
   *   get:
   *     summary: Get shop by ID
   *     tags: [Shop]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: shopId
   *         required: true
   *         schema:
   *           type: string
   *         description: Shop ID
   *     responses:
   *       200:
   *         description: Shop retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Shop'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Shop not found
   */
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
