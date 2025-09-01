import { NextFunction } from "express";
import { ResponseUtil } from "../../util/response.util";
import { OrderService } from "./order.service";
import { AppUtil } from "../../util/app.util";
import { OrderValidation } from "./validation";
import { OrderStatus } from "../../data_moleds/orders.model";
import { BadRequestException } from "../../exception/bad-request.exception";

export class OrderController {
  //
  private service: OrderService;
  constructor() {
    this.service = new OrderService();
  }

  async createOrder(req: any, res: any, next: NextFunction) {
    try {
      const body = req.body;
      const userId = req.user.userId; // From authentication middleware
      const shopId = userId;
      // Add user ID to the order data
      const orderData = { ...body, shopId };
      const data = AppUtil.validate(orderData, OrderValidation.insert);

      const result = await this.service.createOrder(data);

      ResponseUtil.sendResponse(req, res, result);
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
      const userId = req.user?.id;
      const { status, shopId, limit, offset } = req.query;

      const filters = {
        userId,
        status,
        shopId,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };

      const result = await this.service.getOrdersWithFilters(filters);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }

  async getSingleOrder(req: any, res: any, next: NextFunction) {
    try {
      const id = req.params.id;
      const userId = req.user?.id;

      const result = await this.service.getSingleOrderById(id, userId);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }

  async updateOrderStatus(req: any, res: any, next: NextFunction) {
    try {
      const id = req.params.id;
      const { status, driverId, cancellationReason } = req.body;
      const userId = req.user?.userId;

      // Validate status transition
      if (!Object.values(OrderStatus).includes(status)) {
        throw new BadRequestException("Invalid order status");
      }

      // Check if driver ID is required for accepted status

      // Check if cancellation reason is required
      if (
        (status === OrderStatus.CANCELLED || status === OrderStatus.REJECTED) &&
        !cancellationReason
      ) {
        throw new BadRequestException("Cancellation reason is required");
      }

      const updateData = {
        status,
        driverId: driverId ?? null,
        cancellationReason: cancellationReason ?? null,
        updatedBy: userId,
        updatedAt: new Date(),
      };

      const result = await this.service.updateOrderStatus(id, updateData);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }

  async acceptOrder(req: any, res: any, next: NextFunction) {
    try {
      const id = req.params.id;
      const driverId = req.user?.id;

      if (!driverId) {
        throw new BadRequestException("Driver authentication required");
      }

      const result = await this.service.acceptOrder(id, driverId);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }

  async pickupOrder(req: any, res: any, next: NextFunction) {
    try {
      const id = req.params.id;
      const driverId = req.user?.id;

      const result = await this.service.pickupOrder(id, driverId);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }

  async deliverOrder(req: any, res: any, next: NextFunction) {
    try {
      const id = req.params.id;
      const driverId = req.user?.id;

      const result = await this.service.deliverOrder(id, driverId);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }

  async cancelOrder(req: any, res: any, next: NextFunction) {
    try {
      const id = req.params.id;
      const { reason } = req.body;
      const userId = req.user?.id;

      if (!reason) {
        throw new BadRequestException("Cancellation reason is required");
      }

      const result = await this.service.cancelOrder(id, userId, reason);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }

  async getDriverOrders(req: any, res: any, next: NextFunction) {
    try {
      const driverId = req.user?.id;
      const { status } = req.query;

      if (!driverId) {
        throw new BadRequestException("Driver authentication required");
      }

      const result = await this.service.getDriverOrders(driverId, status);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }

  async getShopOrders(req: any, res: any, next: NextFunction) {
    try {
      const shopId = req.user?.shopId || req.user?.id; // Assuming shop owner authentication
      const { status } = req.query;

      if (!shopId) {
        throw new BadRequestException("Shop authentication required");
      }

      const result = await this.service.getShopOrders(shopId, status);
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }

  async findNearbyDriversForOrder(req: any, res: any, next: NextFunction) {
    try {
      const orderId = req.params.id;
      const { radius } = req.query;
      const radiusKm = radius ? parseInt(radius as string) : 10;

      if (!orderId) {
        throw new BadRequestException("Order ID is required");
      }

      const result = await this.service.findNearbyDriversForOrder(
        orderId,
        radiusKm
      );
      ResponseUtil.sendResponse(req, res, result);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }
}
