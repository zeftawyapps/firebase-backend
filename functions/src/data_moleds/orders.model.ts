export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  PICKED_UP = "pickedUp",
  IN_TRANSIT = "inTransit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REJECTED = "rejected",
}

export interface ContactDetails {
  name: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface OrderModel {
  shopId: string;
  id: string;
  driverId?: string;
  senderDetails: ContactDetails;
  recipientDetails: ContactDetails;
  items: OrderItem[];
  totalOrderPrice: number;
  status: OrderStatus;
  createdAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export class Order {
  shopId: string;
  id: string;
  driverId?: string;
  senderDetails: ContactDetails;
  recipientDetails: ContactDetails;
  items: OrderItem[];
  totalOrderPrice: number;
  status: OrderStatus;
  createdAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;

  constructor(data: {
    shopId: string;
    id: string;
    driverId?: string;
    senderDetails: ContactDetails;
    recipientDetails: ContactDetails;
    items: OrderItem[];
    totalOrderPrice: number;
    status: OrderStatus;
    createdAt?: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
  }) {
    this.shopId = data.shopId;
    this.id = data.id;
    this.driverId = data.driverId;
    this.senderDetails = data.senderDetails;
    this.recipientDetails = data.recipientDetails;
    this.items = data.items;
    this.totalOrderPrice = data.totalOrderPrice;
    this.status = data.status;
    this.createdAt = data.createdAt || new Date();
    this.acceptedAt = data.acceptedAt;
    this.pickedUpAt = data.pickedUpAt;
    this.deliveredAt = data.deliveredAt;
    this.cancelledAt = data.cancelledAt;
    this.cancellationReason = data.cancellationReason;
  }

  toJson(): OrderModel {
    return {
      shopId: this.shopId,
      id: this.id,
      driverId: this.driverId || "",
      senderDetails: this.senderDetails,
      recipientDetails: this.recipientDetails,
      items: this.items,
      totalOrderPrice: this.totalOrderPrice,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      acceptedAt: this.acceptedAt?.toISOString(),
      pickedUpAt: this.pickedUpAt?.toISOString(),
      deliveredAt: this.deliveredAt?.toISOString(),
      cancelledAt: this.cancelledAt?.toISOString(),
      cancellationReason: this.cancellationReason,
    };
  }

  static fromJson(json: any, docId: string): Order {
    return new Order({
      shopId: json.shopId,
      id: docId,
      driverId: json.driverId || undefined,
      senderDetails: json.senderDetails,
      recipientDetails: json.recipientDetails,
      items: json.items || [],
      totalOrderPrice: parseFloat(json.totalOrderPrice) || 0,
      status: (json.status as OrderStatus) || OrderStatus.PENDING,
      createdAt: json.createdAt ? new Date(json.createdAt) : new Date(),
      acceptedAt: json.acceptedAt ? new Date(json.acceptedAt) : undefined,
      pickedUpAt: json.pickedUpAt ? new Date(json.pickedUpAt) : undefined,
      deliveredAt: json.deliveredAt ? new Date(json.deliveredAt) : undefined,
      cancelledAt: json.cancelledAt ? new Date(json.cancelledAt) : undefined,
      cancellationReason: json.cancellationReason,
    });
  }

  // Utility methods
  isActive(): boolean {
    return ![
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.REJECTED,
    ].includes(this.status);
  }

  canBeCancelled(): boolean {
    return [OrderStatus.PENDING, OrderStatus.ACCEPTED].includes(this.status);
  }

  canBeAccepted(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  canBePickedUp(): boolean {
    return this.status === OrderStatus.ACCEPTED;
  }

  canBeDelivered(): boolean {
    return (
      this.status === OrderStatus.PICKED_UP ||
      this.status === OrderStatus.IN_TRANSIT
    );
  }

  getDuration(): number | null {
    if (!this.deliveredAt || !this.createdAt) return null;
    return this.deliveredAt.getTime() - this.createdAt.getTime();
  }

  getEstimatedDeliveryTime(): Date | null {
    if (!this.acceptedAt) return null;
    // Add 2 hours as estimated delivery time
    return new Date(this.acceptedAt.getTime() + 2 * 60 * 60 * 1000);
  }

  updateStatus(newStatus: OrderStatus, reason?: string): void {
    const now = new Date();
    this.status = newStatus;

    switch (newStatus) {
      case OrderStatus.ACCEPTED:
        this.acceptedAt = now;
        break;
      case OrderStatus.PICKED_UP:
        this.pickedUpAt = now;
        break;
      case OrderStatus.DELIVERED:
        this.deliveredAt = now;
        break;
      case OrderStatus.CANCELLED:
      case OrderStatus.REJECTED:
        this.cancelledAt = now;
        if (reason) this.cancellationReason = reason;
        break;
    }
  }

  calculateTotalWeight(): number {
    return this.items.reduce((total, item) => {
      return total + (item.weight || 0) * item.quantity;
    }, 0);
  }

  calculateTotalVolume(): number {
    return this.items.reduce((total, item) => {
      if (!item.dimensions) return total;
      const { length, width, height } = item.dimensions;
      return total + length * width * height * item.quantity;
    }, 0);
  }

  getItemsCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  validateOrder(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.shopId) errors.push("Shop ID is required");
    if (!this.senderDetails.name) errors.push("Sender name is required");
    if (!this.senderDetails.phone) errors.push("Sender phone is required");
    if (!this.senderDetails.address) errors.push("Sender address is required");
    if (!this.recipientDetails.name) errors.push("Recipient name is required");
    if (!this.recipientDetails.phone)
      errors.push("Recipient phone is required");
    if (!this.recipientDetails.address)
      errors.push("Recipient address is required");
    if (!this.items.length) errors.push("At least one item is required");
    if (this.totalOrderPrice <= 0)
      errors.push("Total order price must be greater than 0");

    // Validate items
    this.items.forEach((item, index) => {
      if (!item.name) errors.push(`Item ${index + 1}: name is required`);
      if (item.quantity <= 0)
        errors.push(`Item ${index + 1}: quantity must be greater than 0`);
      if (item.unitPrice < 0)
        errors.push(`Item ${index + 1}: unit price cannot be negative`);
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
