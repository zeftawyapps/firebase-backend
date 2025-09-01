import { firebase } from "../../data/firebase-datasource";
import {
  Notification,
  NotificationStatus,
} from "../../data_moleds/notification.model";

export class NotificationRepository {
  private collection = firebase.firestore().collection("notifications");

  async createNotification(data: Notification, id?: string): Promise<string> {
    try {
      if (id) {
        await this.collection.doc(id).set(data);
        return id;
      } else {
        const docRef = await this.collection.add(data);
        return docRef.id;
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    try {
      const doc = await this.collection.doc(id).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as Notification;
      }
      return null;
    } catch (error) {
      console.error("Error getting notification:", error);
      throw error;
    }
  }

  async getNotificationsByDriverId(driverId: string): Promise<Notification[]> {
    try {
      const snapshot = await this.collection
        .where("sendTo", "==", driverId)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
    } catch (error) {
      console.error("Error getting notifications by driver:", error);
      throw error;
    }
  }

  async getNotificationsByOrderId(orderId: string): Promise<Notification[]> {
    try {
      const snapshot = await this.collection
        .where("orderId", "==", orderId)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
    } catch (error) {
      console.error("Error getting notifications by order:", error);
      throw error;
    }
  }

  async updateNotificationStatus(
    id: string,
    status: NotificationStatus
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (status === NotificationStatus.SENT) {
        updateData.sentAt = new Date();
      } else if (status === NotificationStatus.READ) {
        updateData.readAt = new Date();
      }

      await this.collection.doc(id).update(updateData);
    } catch (error) {
      console.error("Error updating notification status:", error);
      throw error;
    }
  }

  async getUnreadNotifications(driverId: string): Promise<Notification[]> {
    try {
      const snapshot = await this.collection
        .where("sendTo", "==", driverId)
        .where("status", "!=", NotificationStatus.READ)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
    } catch (error) {
      console.error("Error getting unread notifications:", error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await this.updateNotificationStatus(id, NotificationStatus.READ);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}
