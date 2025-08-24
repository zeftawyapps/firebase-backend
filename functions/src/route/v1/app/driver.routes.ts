/**
 * @swagger
 * /driver/profile:
 *   get:
 *     summary: Get current driver's profile
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 */
import { Application, NextFunction } from "express";
import { DriverController } from "../../../app/driver/contraller";
import { userAuthMiddleware } from "../../../app/middleware/user-auth.middleware";

export default function (app: Application) {
  const driverController = new DriverController();

  // Create driver
  app.post("/driver", userAuthMiddleware, (req, res, next: NextFunction) => {
    return driverController.createDriver(req, res, next);
  });

  // Get driver profile (for current user)
  app.get(
    "/driver/profile",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return driverController.getDriverProfile(req, res, next);
    }
  );

  // Update driver location
  app.put(
    "/driver/location",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return driverController.updateLocation(req, res, next);
    }
  );

  // Update driver status
  app.put(
    "/driver/status",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return driverController.updateStatus(req, res, next);
    }
  );

  // Set rally point
  app.put(
    "/driver/rally-point",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return driverController.setRallyPoint(req, res, next);
    }
  );

  // Update driver rating
  app.put(
    "/driver/rating",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return driverController.updateRating(req, res, next);
    }
  );

  // Update driver on login (similar to shop)
  app.put(
    "/driverLogin",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      return driverController.updateDriverOnLogIn(req, res, next);
    }
  );
}
