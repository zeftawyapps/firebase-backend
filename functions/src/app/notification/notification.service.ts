import { NotificationRepository } from "./notification.repo";
import {
  Notification,
  NotificationType,
  NotificationStatus,
} from "../../data_moleds/notification.model";
import { BadRequestException } from "../../exception/bad-request.exception";
import * as admin from "firebase-admin";

export class NotificationService {
  private notificationRepo: NotificationRepository;

  constructor() {
    this.notificationRepo = new NotificationRepository();
  }

  async createNotification(
    data: Omit<Notification, "id" | "createdAt" | "updatedAt" | "status">
  ): Promise<string> {
    try {
      const notification: Notification = {
        ...data,
        status: NotificationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const notificationId = await this.notificationRepo.createNotification(
        notification
      );

      // Automatically send the notification after creation
      await this.sendNotification(notificationId);

      return notificationId;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  async sendNotification(notificationId: string): Promise<boolean> {
    try {
      const notification = await this.notificationRepo.getNotificationById(
        notificationId
      );
      if (!notification) {
        throw new BadRequestException("Notification not found");
      }

      if (!notification.notificationToken) {
        console.warn(
          `No notification token for notification ${notificationId}`
        );
        await this.notificationRepo.updateNotificationStatus(
          notificationId,
          NotificationStatus.FAILED
        );
        return false;
      }

      // Prepare FCM message
      const message = {
        notification: {
          title: notification.title,
          body: notification.message,
        },
        data: {
          orderId: notification.orderId,
          type: notification.type,
          notificationId: notificationId,
          ...(notification.orderData && {
            senderName: notification.orderData.senderName,
            senderAddress: notification.orderData.senderAddress,
            recipientName: notification.orderData.recipientName,
            recipientAddress: notification.orderData.recipientAddress,
            total: notification.orderData.total.toString(),
          }),
        },
        token: notification.notificationToken,
      };

      // Send FCM notification
      const response = await admin.messaging().send(message);
      console.log("Successfully sent message:", response);

      // Update notification status to sent
      await this.notificationRepo.updateNotificationStatus(
        notificationId,
        NotificationStatus.SENT
      );

      return true;
    } catch (error) {
      console.error("Error sending notification:", error);

      // Update notification status to failed
      await this.notificationRepo.updateNotificationStatus(
        notificationId,
        NotificationStatus.FAILED
      );

      return false;
    }
  }

  async sendNotificationToDrivers(
    driverIds: string[],
    driverData: any[],
    orderData: any
  ): Promise<{ success: number; failed: number; notifications: string[] }> {
    try {
      const results = {
        success: 0,
        failed: 0,
        notifications: [] as string[],
      };

      for (let i = 0; i < driverIds.length; i++) {
        const driverId = driverIds[i];
        const driver = driverData[i];

        try {
          const notificationData = {
            title: "New Order Available",
            message: `New delivery order from ${orderData.senderDetails.name} to ${orderData.recipientDetails.name}. Total: $${orderData.total}`,
            sendTo: driverId,
            userName: driver.name,
            notificationToken: driver.notificationToken || "",
            orderId: orderData.orderId,
            orderData: {
              senderName: orderData.senderDetails.name,
              senderAddress: orderData.senderDetails.address,
              recipientName: orderData.recipientDetails.name,
              recipientAddress: orderData.recipientDetails.address,
              total: orderData.total,
              items: orderData.items,
            },
            type: NotificationType.NEW_ORDER,
          };

          const notificationId = await this.createNotification(
            notificationData
          );
          results.notifications.push(notificationId);
          results.success++;
        } catch (error) {
          console.error(
            `Failed to send notification to driver ${driverId}:`,
            error
          );
          results.failed++;
        }
      }

      return results;
    } catch (error) {
      console.error("Error sending notifications to drivers:", error);
      throw error;
    }
  }

  async getDriverNotifications(driverId: string): Promise<Notification[]> {
    try {
      return await this.notificationRepo.getNotificationsByDriverId(driverId);
    } catch (error) {
      console.error("Error getting driver notifications:", error);
      throw error;
    }
  }

  async getOrderNotifications(orderId: string): Promise<Notification[]> {
    try {
      return await this.notificationRepo.getNotificationsByOrderId(orderId);
    } catch (error) {
      console.error("Error getting order notifications:", error);
      throw error;
    }
  }

  async getUnreadNotifications(driverId: string): Promise<Notification[]> {
    try {
      return await this.notificationRepo.getUnreadNotifications(driverId);
    } catch (error) {
      console.error("Error getting unread notifications:", error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await this.notificationRepo.markAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async markNotificationAsDelivered(notificationId: string): Promise<void> {
    try {
      await this.notificationRepo.updateNotificationStatus(
        notificationId,
        NotificationStatus.DELIVERED
      );
    } catch (error) {
      console.error("Error marking notification as delivered:", error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await this.notificationRepo.deleteNotification(notificationId);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}
