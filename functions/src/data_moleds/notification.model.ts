export interface Notification {
  id?: string;
  title: string;
  message: string;
  sendTo: string; // driver ID
  userName: string; // driver name
  notificationToken: string;
  orderId: string;
  orderData?: {
    senderName: string;
    senderAddress: string;
    recipientName: string;
    recipientAddress: string;
    total: number;
    items: any[];
  };
  type: NotificationType;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  readAt?: Date;
}

export enum NotificationType {
  NEW_ORDER = "new_order",
  ORDER_ACCEPTED = "order_accepted",
  ORDER_CANCELLED = "order_cancelled",
  ORDER_DELIVERED = "order_delivered",
  GENERAL = "general",
}

export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}
