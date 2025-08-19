import { Application, NextFunction } from "express";
import { LocationPointController } from "../../../app/location-point/controller";
import { userAuthMiddleware } from "../../../app/middleware/user-auth.middleware";

export default function (app: Application) {
  const locationPointController = new LocationPointController();

  // Update location point
  app.put("/location-point/:id", userAuthMiddleware, (req, res, next: NextFunction) => {
    return locationPointController.updateLocationPoint(req, res, next);
  });

  // Update driver location
  app.put("/location-point/driver/:driverId", userAuthMiddleware, (req, res, next: NextFunction) => {
    return locationPointController.updateDriverLocation(req, res, next);
  });

  // Update order status in location points
  app.put("/location-point/order/status", userAuthMiddleware, (req, res, next: NextFunction) => {
    return locationPointController.updateOrderStatusInLocationPoints(req, res, next);
  });
}
