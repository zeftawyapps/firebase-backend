import { LocationPointRepo } from "./repo";
import { LocationPoint, LocationType, Location } from "../../data_moleds";

export class LocationPointService {
  private locationPointRepo: LocationPointRepo;

  constructor() {
    this.locationPointRepo = new LocationPointRepo();
  }

  // Create location point
  async createLocationPoint(locationPoint: LocationPoint): Promise<string> {
    try {
      return await this.locationPointRepo.createLocationPoint(
        locationPoint.locationId,
        locationPoint
      );
    } catch (error) {
      console.error("Error in service creating location point:", error);
      throw error;
    }
  }

  // Get location point by ID
  async getLocationPointById(id: string): Promise<LocationPoint | null> {
    try {
      return await this.locationPointRepo.getLocationPointById(id);
    } catch (error) {
      console.error("Error in service getting location point:", error);
      throw error;
    }
  }

  // Update location point
  async updateLocationPoint(
    id: string,
    data: Partial<LocationPoint>
  ): Promise<void> {
    try {
      await this.locationPointRepo.updateLocationPoint(id, data);
    } catch (error) {
      console.error("Error in service updating location point:", error);
      throw error;
    }
  }

  // Delete location point
  async deleteLocationPoint(id: string): Promise<void> {
    try {
      await this.locationPointRepo.deleteLocationPoint(id);
    } catch (error) {
      console.error("Error in service deleting location point:", error);
      throw error;
    }
  }

  // Get all location points
  async getAllLocationPoints(): Promise<LocationPoint[]> {
    try {
      return await this.locationPointRepo.getAllLocationPoints();
    } catch (error) {
      console.error("Error in service getting all location points:", error);
      throw error;
    }
  }

  // Get location points by type
  async getLocationPointsByType(type: LocationType): Promise<LocationPoint[]> {
    try {
      return await this.locationPointRepo.getLocationPointsByType(type);
    } catch (error) {
      console.error("Error in service getting location points by type:", error);
      throw error;
    }
  }

  // Get active location points
  async getActiveLocationPoints(): Promise<LocationPoint[]> {
    try {
      return await this.locationPointRepo.getActiveLocationPoints();
    } catch (error) {
      console.error("Error in service getting active location points:", error);
      throw error;
    }
  }

  // Get nearby location points
  async getNearbyLocationPoints(
    latitude: number,
    longitude: number,
    radiusKm = 10
  ): Promise<LocationPoint[]> {
    try {
      return await this.locationPointRepo.getNearbyLocationPoints(
        latitude,
        longitude,
        radiusKm
      );
    } catch (error) {
      console.error("Error in service getting nearby location points:", error);
      throw error;
    }
  }

  // Create driver location point
  async createDriverLocationPoint(data: {
    driverId: string;
    driverName: string;
    location: Location;
    phone?: string;
    status?: string;
    rating?: number;
  }): Promise<string> {
    try {
      const locationPoint = LocationPoint.fromDriver(data);
      return await this.createLocationPoint(locationPoint);
    } catch (error) {
      console.error("Error in service creating driver location point:", error);
      throw error;
    }
  }

  // Create shop location point
  async createShopLocationPoint(data: {
    shopId: string;
    shopName: string;
    location: Location;
    address?: string;
    phone?: string;
    isActive?: boolean;
  }): Promise<string> {
    try {
      const locationPoint = LocationPoint.fromShop(data);
      return await this.createLocationPoint(locationPoint);
    } catch (error) {
      console.error("Error in service creating shop location point:", error);
      throw error;
    }
  }

  // Create order pickup location point
  async createOrderPickupLocationPoint(data: {
    orderId: string;
    shopName: string;
    location: Location;
    customerName?: string;
    orderStatus?: string;
    totalPrice?: number;
  }): Promise<string> {
    try {
      const locationPoint = LocationPoint.fromOrderPickup(data);
      return await this.createLocationPoint(locationPoint);
    } catch (error) {
      console.error(
        "Error in service creating order pickup location point:",
        error
      );
      throw error;
    }
  }

  // Create order delivery location point
  async createOrderDeliveryLocationPoint(data: {
    orderId: string;
    customerName: string;
    location: Location;
    address?: string;
    phone?: string;
    orderStatus?: string;
    totalPrice?: number;
  }): Promise<string> {
    try {
      const locationPoint = LocationPoint.fromOrderDelivery(data);
      return await this.createLocationPoint(locationPoint);
    } catch (error) {
      console.error(
        "Error in service creating order delivery location point:",
        error
      );
      throw error;
    }
  }

  // Update driver location
  async updateDriverLocation(
    driverId: string,
    location: Location,
    status?: string
  ): Promise<void> {
    try {
      const locationId = `driver_${driverId}`;
      const existingPoint = await this.getLocationPointById(locationId);

      if (!existingPoint) {
        throw new Error("Driver location point not found");
      }

      const updateData: any = {
        location: location,
        lastUpdated: new Date(),
      };

      if (status) {
        updateData.metadata = {
          ...existingPoint.metadata,
          status: status,
        };
      }

      await this.updateLocationPoint(locationId, updateData);
    } catch (error) {
      console.error("Error in service updating driver location:", error);
      throw error;
    }
  }

  // Get drivers near location
  async getDriversNearLocation(
    latitude: number,
    longitude: number,
    radiusKm = 10
  ): Promise<LocationPoint[]> {
    try {
      const nearbyPoints = await this.getNearbyLocationPoints(
        latitude,
        longitude,
        radiusKm
      );

      return nearbyPoints.filter((point) => point.type === LocationType.DRIVER);
    } catch (error) {
      console.error("Error in service getting drivers near location:", error);
      throw error;
    }
  }

  // Get shops near location
  async getShopsNearLocation(
    latitude: number,
    longitude: number,
    radiusKm = 10
  ): Promise<LocationPoint[]> {
    try {
      const nearbyPoints = await this.getNearbyLocationPoints(
        latitude,
        longitude,
        radiusKm
      );

      return nearbyPoints.filter((point) => point.type === LocationType.SHOP);
    } catch (error) {
      console.error("Error in service getting shops near location:", error);
      throw error;
    }
  }

  // Toggle location point active status
  async toggleActiveStatus(id: string): Promise<void> {
    try {
      await this.locationPointRepo.toggleActiveStatus(id);
    } catch (error) {
      console.error("Error in service toggling active status:", error);
      throw error;
    }
  }

  // Clean up location points for entity
  async cleanupLocationPointsForEntity(entityId: string): Promise<void> {
    try {
      await this.locationPointRepo.deleteLocationPointsByEntityId(entityId);
    } catch (error) {
      console.error("Error in service cleaning up location points:", error);
      throw error;
    }
  }

  // Get location points by entity ID
  async getLocationPointsByEntityId(
    entityId: string
  ): Promise<LocationPoint[]> {
    try {
      return await this.locationPointRepo.getLocationPointsByEntityId(entityId);
    } catch (error) {
      console.error(
        "Error in service getting location points by entity ID:",
        error
      );
      throw error;
    }
  }

  // Update order status in location points
  async updateOrderStatusInLocationPoints(
    orderId: string,
    newStatus: string
  ): Promise<void> {
    try {
      const orderLocationPoints = await this.getLocationPointsByEntityId(
        orderId
      );

      for (const point of orderLocationPoints) {
        const updatedMetadata = {
          ...point.metadata,
          orderStatus: newStatus,
        };

        await this.updateLocationPoint(point.locationId, {
          metadata: updatedMetadata,
        });
      }
    } catch (error) {
      console.error(
        "Error in service updating order status in location points:",
        error
      );
      throw error;
    }
  }

  // Search location points by name or description
  async searchLocationPoints(searchTerm: string): Promise<LocationPoint[]> {
    try {
      const allPoints = await this.getAllLocationPoints();
      const lowercaseSearchTerm = searchTerm.toLowerCase();

      return allPoints.filter(
        (point) =>
          point.name.toLowerCase().includes(lowercaseSearchTerm) ||
          (point.description &&
            point.description.toLowerCase().includes(lowercaseSearchTerm))
      );
    } catch (error) {
      console.error("Error in service searching location points:", error);
      throw error;
    }
  }
}
