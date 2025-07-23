import { NextFunction, Response } from "express";
import { ResponseUtil } from "../../util/response.util";

import { AppUtil } from "../../util/app.util";
import { DriverService } from "./service";
import { driverValidation } from "./validation";

export class DriverController {
  service: DriverService;
  constructor() {
    this.service = new DriverService();
  }

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
