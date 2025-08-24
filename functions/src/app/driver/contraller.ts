import { NextFunction, Response } from "express";
import { ResponseUtil } from "../../util/response.util";

import { AppUtil } from "../../util/app.util";
import { DriverService } from "./service";
import { driverValidation } from "./validation";
import { LocationPointService } from "../location-point/service";
// Update driver on login (similar to shop)
// async updateDriverOnLogIn(req: any, res: Response, next: NextFunction) {
//   try {
//     const data = req.body;
//     const uid = req.user.userId;
//     // Use updateDriverLogin validation if exists, else fallback to updateStatus
//     const validationSchema = driverValidation.updateDriverLogin || driverValidation.updateStatus;
//     const body = AppUtil.validate(data, validationSchema);
//     await this.service.updateDriver(uid, body);

//     // Retrieve updated driver data
//     const updatedDriver = await this.service.getDriverProfile(uid);

//     // Update or set location point
//     const { id, name, currentLocation, phone, status, rating } = updatedDriver;
//     const locationPointService = new LocationPointService();
//     await locationPointService.createDriverLocationPoint({
//       driverId: id,
//       driverName: name,
//       location: currentLocation || { latitude: 30, longitude: 30, address: "No Address" },
//       phone: phone || "No Phone",
//       status: status,
//       rating: rating || 0,
//     });

//     ResponseUtil.sendResponse(req, res, "Driver updated successfully");
//   } catch (e) {
//     ResponseUtil.sendException(req, res, e);
//     next(e);
//   }
// }

/**
 * @swagger
 * tags:
 *   name: Driver
 *   description: Driver management endpoints
 */
export class DriverController {
  service: DriverService;
  constructor() {
    this.service = new DriverService();
  }

  async updateDriverOnLogIn(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      // Fallback to updateStatus if updateDriverLogin does not exist
      const body = AppUtil.validate(data, driverValidation.updateDriverLogin);
      await this.service.updateDriverOnLogIn(uid, body.notificationToken);

      // Retrieve updated driver data
      const updatedDriver: any = await this.service.getDriverById(uid);

      // Update or set location point

      const locationPointService = new LocationPointService();
      await locationPointService.createDriverLocationPoint({
        driverId: updatedDriver.id,
        driverName: updatedDriver.name,
        location: updatedDriver.currentLocation || {
          latitude: 30,
          longitude: 30,
          address: "No Address",
        },
        phone: updatedDriver.phone || "No Phone",
        status: updatedDriver.status,
        rating: updatedDriver.rating || 0,
      });

      ResponseUtil.sendResponse(req, res, "Driver updated successfully");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  /**
   * @swagger
   * /driver:
   *   post:
   *     summary: Create a new driver profile
   *     tags: [Driver]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               currentLocation:
   *                 $ref: '#/components/schemas/Location'
   *               rallyPoint:
   *                 $ref: '#/components/schemas/Location'
   *     responses:
   *       200:
   *         description: Driver created successfully
   *       401:
   *         description: Unauthorized
   */
  // Create driver profile
  async createDriver(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      const body = AppUtil.validate(data, driverValidation.createDriver);
      await this.service.createDriver(uid, body);
      ResponseUtil.sendResponse(req, res, "Driver created successfully");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  /**
   * @swagger
   * /driver/location:
   *   put:
   *     summary: Update driver location
   *     tags: [Driver]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               latitude:
   *                 type: number
   *               longitude:
   *                 type: number
   *               address:
   *                 type: string
   *     responses:
   *       200:
   *         description: Location updated successfully
   *       401:
   *         description: Unauthorized
   */
  // Update driver location
  async updateLocation(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      const body = AppUtil.validate(data, driverValidation.updateLocation);
      await this.service.updateLocation(uid, body);
      ResponseUtil.sendResponse(req, res, "Location updated successfully");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // Update driver status
  async updateStatus(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      const body = AppUtil.validate(data, driverValidation.updateStatus);
      await this.service.updateStatus(uid, body.status);
      ResponseUtil.sendResponse(req, res, "Status updated successfully");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // Get driver profile
  async getDriverProfile(req: any, res: Response, next: NextFunction) {
    try {
      const uid = req.user.userId;
      const driver = await this.service.getDriverProfile(uid);
      ResponseUtil.sendResponse(req, res, driver);
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // Get nearby drivers
  // async getNearbyDrivers(req: any, res: Response, next: NextFunction) {
  //   try {
  //     const { latitude, longitude, radius } = req.query;
  //     const location = {
  //       latitude: parseFloat(latitude),
  //       longitude: parseFloat(longitude),
  //     };
  //     const drivers = await this.service.getNearbyDrivers(
  //       location,
  //       parseInt(radius) || 5
  //     );
  //     ResponseUtil.sendResponse(req, res, drivers);
  //   } catch (e) {
  //     ResponseUtil.sendException(req, res, e);
  //     next(e);
  //   }
  // }

  // Set rally point
  async setRallyPoint(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const uid = req.user.userId;
      const body = AppUtil.validate(data, driverValidation.setRallyPoint);
      await this.service.setRallyPoint(uid, body.rallyPoint);
      ResponseUtil.sendResponse(req, res, "Rally point set successfully");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }

  // Update driver rating
  async updateRating(req: any, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const body = AppUtil.validate(data, driverValidation.updateRating);
      await this.service.updateRating(body.driverId, body.rating);
      ResponseUtil.sendResponse(req, res, "Rating updated successfully");
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }
}
