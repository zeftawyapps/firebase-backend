/**
 * @swagger
 * /shops:
 *   get:
 *     summary: Get all active shops
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active shops
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shop'
 *       401:
 *         description: Unauthorized
 */
import { Application, NextFunction } from "express";
import { ShopController } from "../../../app/shop/contraller";
import { userAuthMiddleware } from "../../../app/middleware/user-auth.middleware";

export default function (app: Application) {
  const shopController = new ShopController();

  // Create shop
  app.post("/shop", userAuthMiddleware, (req, res, next: NextFunction) => {
    return shopController.createShop(req, res, next);
  });

  // Get shop by ID
  app.get("/shop/:shopId", userAuthMiddleware, (req, res, next: NextFunction) => {
    return shopController.getShopById(req, res, next);
  });

  // Get all active shops
  app.get("/shops", userAuthMiddleware, (req, res, next: NextFunction) => {
    return shopController.getAllActiveShops(req, res, next);
  });

  // Update shop
  app.put("/shop", userAuthMiddleware, (req, res, next: NextFunction) => {
    return shopController.updateShop(req, res, next);
  });

  // Get shop profile (for current user)
  app.get("/shop/profile", userAuthMiddleware, (req, res, next: NextFunction) => {
    return shopController.getShopProfile(req, res, next);
  });

  // Toggle shop status
  app.patch("/shop/toggle-status", userAuthMiddleware, (req, res, next: NextFunction) => {
    return shopController.toggleShopStatus(req, res, next);
  });

  // Update shop location
  app.put("/shop/location", userAuthMiddleware, (req, res, next: NextFunction) => {
    return shopController.updateShopLocation(req, res, next);
  });
}
