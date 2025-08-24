import { Location, LocationModel } from "./location.model";

export enum LocationType {
  DRIVER = "driver",
  SHOP = "shop",
  ORDER_PICKUP = "order_pickup",
  ORDER_DELIVERY = "order_delivery",
}

export class LocationPoint {
  locationId: string;
  name: string;
  description?: string;
  location: LocationModel;
  type: LocationType;
  entityId?: string; // ID of the related driver, shop, or order
  metadata?: { [key: string]: any }; // Additional data based on type
  lastUpdated: Date;
  isActive: boolean;

  constructor(data: {
    locationId: string;
    name: string;
    description?: string;
    location: Location;
    type: LocationType;
    entityId?: string;
    metadata?: { [key: string]: any };
    lastUpdated?: Date;
    isActive?: boolean;
  }) {
    this.locationId = data.locationId;
    this.name = data.name;
    this.description = data.description;
    this.location = new LocationModel(data.location);
    this.type = data.type;
    this.entityId = data.entityId;
    this.metadata = data.metadata;
    this.lastUpdated = data.lastUpdated || new Date();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  toJson(): any {
    return {
      locationId: this.locationId,
      name: this.name,
      description: this.description,
      location: this.location.toJson(),
      type: this.type,
      entityId: this.entityId,
      metadata: this.metadata,
      lastUpdated: this.lastUpdated.toISOString(),
      isActive: this.isActive,
    };
  }

  static fromJson(json: any, id?: string): LocationPoint {
    return new LocationPoint({
      locationId: id || json.locationId || json.id,
      name: json.name || "",
      description: json.description,
      location: json.location
        ? LocationModel.fromJson(json.location)
        : { latitude: 0, longitude: 0 },
      type: Object.values(LocationType).includes(json.type)
        ? (json.type as LocationType)
        : LocationType.DRIVER,
      entityId: json.entityId,
      metadata: json.metadata,
      lastUpdated: json.lastUpdated ? new Date(json.lastUpdated) : new Date(),
      isActive: json.isActive !== undefined ? json.isActive : true,
    });
  }

  // Factory constructors for specific types
  static fromDriver(data: {
    driverId: string;
    driverName: string;
    location: Location;
    phone?: string;
    status?: string;
    rating?: number;
  }): LocationPoint {
    return new LocationPoint({
      locationId: `${data.driverId}`,
      name: data.driverName,
      description: "سائق",
      location: data.location,
      type: LocationType.DRIVER,
      entityId: data.driverId,
      metadata: {
        phone: data.phone,
        status: data.status,
        rating: data.rating,
      },
      lastUpdated: new Date(),
      isActive: true,
    });
  }

  static fromShop(data: {
    shopId: string;
    shopName: string;
    location: Location;
    address?: string;
    phone?: string;
    isActive?: boolean;
  }): LocationPoint {
    return new LocationPoint({
      locationId: `${data.shopId}`,
      name: data.shopName,
      description: data.address || "محل",
      location: data.location,
      type: LocationType.SHOP,
      entityId: data.shopId,
      metadata: {
        address: data.address || "No Address",
        phone: data.phone,
        isActive: data.isActive ? data.isActive : true,
      },
      lastUpdated: new Date(),
      isActive: data.isActive !== undefined ? data.isActive : true,
    });
  }

  static fromOrderPickup(data: {
    orderId: string;
    shopName: string;
    location: Location;
    customerName?: string;
    orderStatus?: string;
    totalPrice?: number;
  }): LocationPoint {
    return new LocationPoint({
      locationId: `${data.orderId}`,
      name: `استلام من ${data.shopName}`,
      description: "نقطة استلام الطلب",
      location: data.location,
      type: LocationType.ORDER_PICKUP,
      entityId: data.orderId,
      metadata: {
        shopName: data.shopName,
        customerName: data.customerName,
        orderStatus: data.orderStatus,
        totalPrice: data.totalPrice,
      },
      lastUpdated: new Date(),
      isActive: true,
    });
  }

  static fromOrderDelivery(data: {
    orderId: string;
    customerName: string;
    location: Location;
    address?: string;
    phone?: string;
    orderStatus?: string;
    totalPrice?: number;
  }): LocationPoint {
    return new LocationPoint({
      locationId: `${data.orderId}`,
      name: `توصيل إلى ${data.customerName}`,
      description: data.address || "نقطة توصيل الطلب",
      location: data.location,
      type: LocationType.ORDER_DELIVERY,
      entityId: data.orderId,
      metadata: {
        customerName: data.customerName,
        address: data.address,
        phone: data.phone,
        orderStatus: data.orderStatus,
        totalPrice: data.totalPrice,
      },
      lastUpdated: new Date(),
      isActive: true,
    });
  }

  // Helper getters
  get typeDisplayName(): string {
    switch (this.type) {
      case LocationType.DRIVER:
        return "سائق";
      case LocationType.SHOP:
        return "محل";
      case LocationType.ORDER_PICKUP:
        return "استلام طلب";
      case LocationType.ORDER_DELIVERY:
        return "توصيل طلب";
      default:
        return "غير محدد";
    }
  }

  get statusText(): string {
    switch (this.type) {
      case LocationType.DRIVER:
        return this.metadata?.status || "غير محدد";
      case LocationType.SHOP:
        return this.metadata?.isActive === true ? "نشط" : "غير نشط";
      case LocationType.ORDER_PICKUP:
      case LocationType.ORDER_DELIVERY:
        return this.metadata?.orderStatus || "غير محدد";
      default:
        return "غير محدد";
    }
  }

  get phoneNumber(): string | undefined {
    return this.metadata?.phone;
  }

  get rating(): number | undefined {
    return this.metadata?.rating;
  }

  get totalPrice(): number | undefined {
    return this.metadata?.totalPrice;
  }

  // Calculate distance from this location to another
  distanceTo(other: LocationPoint): number {
    return this.location.distanceTo(other.location);
  }

  // Update metadata
  updateMetadata(newMetadata: { [key: string]: any }): void {
    this.metadata = { ...this.metadata, ...newMetadata };
    this.lastUpdated = new Date();
  }

  // Update location
  updateLocation(newLocation: Location): void {
    this.location = new LocationModel(newLocation);
    this.lastUpdated = new Date();
  }
}
