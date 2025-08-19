import { Request, Response, NextFunction } from "express";
import { LocationPointService } from "./service";
import { AppUtil } from "../../util/app.util";
import { ResponseUtil } from "../../util/response.util";
import { locationPointValidation } from "./validation";
import { LocationType } from "../../data_moleds";

export class LocationPointController {
  private locationPointService: LocationPointService;

  constructor() {
    this.locationPointService = new LocationPointService();
  }

  // Create a new location point
  async createLocationPoint(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, locationPointValidation.create);

      const result = await this.locationPointService.createLocationPoint(data);
      ResponseUtil.sendResponse(req, res, {
        id: result,
        message: "Location point created successfully",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Get location point by ID
  async getLocationPointById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id) {
        throw new Error("Location point ID is required");
      }

      const result = await this.locationPointService.getLocationPointById(id);

      if (!result) {
        res.status(404).json({ message: "Location point not found" });
        return;
      }

      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Update location point
  async updateLocationPoint(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const body = req.body;

      if (!id) {
        throw new Error("Location point ID is required");
      }

      const data = AppUtil.validate(body, locationPointValidation.update);
      await this.locationPointService.updateLocationPoint(id, data);

      ResponseUtil.sendResponse(req, res, {
        message: "Location point updated successfully",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Delete location point
  async deleteLocationPoint(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id) {
        throw new Error("Location point ID is required");
      }

      await this.locationPointService.deleteLocationPoint(id);
      ResponseUtil.sendResponse(req, res, {
        message: "Location point deleted successfully",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Get all location points
  async getAllLocationPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.locationPointService.getAllLocationPoints();
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Get location points by type
  async getLocationPointsByType(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const type = req.params.type as LocationType;

      if (!Object.values(LocationType).includes(type)) {
        throw new Error("Invalid location type");
      }

      const result = await this.locationPointService.getLocationPointsByType(
        type
      );
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Get active location points
  async getActiveLocationPoints(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.locationPointService.getActiveLocationPoints();
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Get nearby location points
  async getNearbyLocationPoints(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, locationPointValidation.nearby);

      const result = await this.locationPointService.getNearbyLocationPoints(
        data.latitude,
        data.longitude,
        data.radiusKm
      );

      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Create driver location point
  async createDriverLocationPoint(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, locationPointValidation.createDriver);

      const result = await this.locationPointService.createDriverLocationPoint(
        data
      );
      ResponseUtil.sendResponse(req, res, {
        id: result,
        message: "Driver location point created successfully",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Create shop location point
  async createShopLocationPoint(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, locationPointValidation.createShop);

      const result = await this.locationPointService.createShopLocationPoint(
        data
      );
      ResponseUtil.sendResponse(req, res, {
        id: result,
        message: "Shop location point created successfully",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Create order pickup location point
  async createOrderPickupLocationPoint(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = req.body;
      const data = AppUtil.validate(
        body,
        locationPointValidation.createOrderPickup
      );

      const result =
        await this.locationPointService.createOrderPickupLocationPoint(data);
      ResponseUtil.sendResponse(req, res, {
        id: result,
        message: "Order pickup location point created successfully",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Create order delivery location point
  async createOrderDeliveryLocationPoint(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = req.body;
      const data = AppUtil.validate(
        body,
        locationPointValidation.createOrderDelivery
      );

      const result =
        await this.locationPointService.createOrderDeliveryLocationPoint(data);
      ResponseUtil.sendResponse(req, res, {
        id: result,
        message: "Order delivery location point created successfully",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Update driver location
  async updateDriverLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const driverId = req.params.driverId;
      const body = req.body;

      if (!driverId) {
        throw new Error("Driver ID is required");
      }

      const data = AppUtil.validate(
        body,
        locationPointValidation.updateCoordinates
      );

      await this.locationPointService.updateDriverLocation(
        driverId,
        data,
        body.status
      );

      ResponseUtil.sendResponse(req, res, {
        message: "Driver location updated successfully",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Get drivers near location
  async getDriversNearLocation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, locationPointValidation.nearby);

      const result = await this.locationPointService.getDriversNearLocation(
        data.latitude,
        data.longitude,
        data.radiusKm
      );

      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Get shops near location
  async getShopsNearLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, locationPointValidation.nearby);

      const result = await this.locationPointService.getShopsNearLocation(
        data.latitude,
        data.longitude,
        data.radiusKm
      );

      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Toggle active status
  async toggleActiveStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id) {
        throw new Error("Location point ID is required");
      }

      await this.locationPointService.toggleActiveStatus(id);
      ResponseUtil.sendResponse(req, res, {
        message: "Active status toggled successfully",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Search location points
  async searchLocationPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, locationPointValidation.search);

      const result = await this.locationPointService.searchLocationPoints(
        data.searchTerm
      );
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Get location points by entity ID
  async getLocationPointsByEntityId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const entityId = req.params.entityId;

      if (!entityId) {
        throw new Error("Entity ID is required");
      }

      const result =
        await this.locationPointService.getLocationPointsByEntityId(entityId);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Update order status in location points
  async updateOrderStatusInLocationPoints(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = req.body;
      const data = AppUtil.validate(
        body,
        locationPointValidation.updateOrderStatus
      );

      await this.locationPointService.updateOrderStatusInLocationPoints(
        data.orderId,
        data.newStatus
      );

      ResponseUtil.sendResponse(req, res, {
        message: "Order status updated successfully in location points",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }

  // Clean up location points for entity
  async cleanupLocationPointsForEntity(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const entityId = req.params.entityId;

      if (!entityId) {
        throw new Error("Entity ID is required");
      }

      await this.locationPointService.cleanupLocationPointsForEntity(entityId);
      ResponseUtil.sendResponse(req, res, {
        message: "Location points cleaned up successfully",
      });
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
      next(error);
    }
  }
}
