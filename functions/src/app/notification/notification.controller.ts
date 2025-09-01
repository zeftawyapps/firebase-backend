import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service";
import { ResponseUtil } from "../../util/response.util";
import { BadRequestException } from "../../exception/bad-request.exception";

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  // Get notifications for a specific driver
  getDriverNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { driverId } = req.params;

      if (!driverId) {
        throw new BadRequestException("Driver ID is required");
      }

      const notifications =
        await this.notificationService.getDriverNotifications(driverId);

      ResponseUtil.sendResponse(
        req,
        res,
        notifications,
        "Driver notifications retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  };

  // Get unread notifications for a driver
  getUnreadNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { driverId } = req.params;

      if (!driverId) {
        throw new BadRequestException("Driver ID is required");
      }

      const notifications =
        await this.notificationService.getUnreadNotifications(driverId);

      ResponseUtil.sendResponse(
        req,
        res,
        { notifications, count: notifications.length },
        "Unread notifications retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  };

  // Get notifications for a specific order
  getOrderNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        throw new BadRequestException("Order ID is required");
      }

      const notifications =
        await this.notificationService.getOrderNotifications(orderId);

      ResponseUtil.sendResponse(
        req,
        res,
        notifications,
        "Order notifications retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  };

  // Mark notification as read
  markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        throw new BadRequestException("Notification ID is required");
      }

      await this.notificationService.markNotificationAsRead(notificationId);

      ResponseUtil.sendResponse(
        req,
        res,
        {},
        "Notification marked as read successfully"
      );
    } catch (error) {
      next(error);
    }
  };

  // Mark notification as delivered (for FCM delivery confirmation)
  markAsDelivered = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        throw new BadRequestException("Notification ID is required");
      }

      await this.notificationService.markNotificationAsDelivered(
        notificationId
      );

      ResponseUtil.sendResponse(
        req,
        res,
        {},
        "Notification marked as delivered successfully"
      );
    } catch (error) {
      next(error);
    }
  };

  // Delete notification
  deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        throw new BadRequestException("Notification ID is required");
      }

      await this.notificationService.deleteNotification(notificationId);

      ResponseUtil.sendResponse(
        req,
        res,
        {},
        "Notification deleted successfully"
      );
    } catch (error) {
      next(error);
    }
  };

  // Resend notification (for failed notifications)
  resendNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        throw new BadRequestException("Notification ID is required");
      }

      const success = await this.notificationService.sendNotification(
        notificationId
      );

      ResponseUtil.sendResponse(
        req,
        res,
        { success },
        success
          ? "Notification resent successfully"
          : "Failed to resend notification"
      );
    } catch (error) {
      next(error);
    }
  };
}
