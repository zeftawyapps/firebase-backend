import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../util/base.repository";
import { LocationPoint, LocationType } from "../../data_moleds";

export class LocationPointRepo extends BaseRepository {
  // Create a new location point
  async createLocationPoint(
    id: string,
    locationPoint: LocationPoint
  ): Promise<string> {
    try {
      const mydata = locationPoint.toJson();
      // Fix: Ensure location.address is not undefined
      if (mydata.location && typeof mydata.location.address === "undefined") {
        mydata.location.address = "";
      }
      await this.insertById(CollectionsName.locationPoints, id, mydata);
      return id;
    } catch (error) {
      console.error("Error creating location point:", error);
      throw error;
    }
  }

  // Get location point by ID
  async getLocationPointById(id: string): Promise<LocationPoint | null> {
    try {
      const doc = await this.getDocumentReference(
        CollectionsName.locationPoints,
        id
      ).get();

      if (!doc.exists) {
        return null;
      }

      return LocationPoint.fromJson(doc.data(), doc.id);
    } catch (error) {
      console.error("Error getting location point:", error);
      throw error;
    }
  }

  // Update location point
  async updateLocationPoint(
    id: string,
    data: Partial<LocationPoint>
  ): Promise<void> {
    try {
      const updateData = {
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      // Fix: Ensure location.address is not undefined
      if (
        updateData.location &&
        typeof updateData.location.address === "undefined"
      ) {
        updateData.location.address = "";
      }
      await this.update(CollectionsName.locationPoints, id, updateData);
    } catch (error) {
      console.error("Error updating location point:", error);
      throw error;
    }
  }

  // Delete location point
  async deleteLocationPoint(id: string): Promise<void> {
    try {
      await this.delete(CollectionsName.locationPoints, id);
    } catch (error) {
      console.error("Error deleting location point:", error);
      throw error;
    }
  }

  // Get all location points
  async getAllLocationPoints(): Promise<LocationPoint[]> {
    try {
      const collection = this.getCollectionReference(
        CollectionsName.locationPoints
      );
      const snapshot = await collection.get();

      const locationPoints: LocationPoint[] = [];
      snapshot.forEach((doc) => {
        locationPoints.push(LocationPoint.fromJson(doc.data(), doc.id));
      });

      return locationPoints;
    } catch (error) {
      console.error("Error getting all location points:", error);
      throw error;
    }
  }

  // Get location points by type
  async getLocationPointsByType(type: LocationType): Promise<LocationPoint[]> {
    try {
      const collection = this.getCollectionReference(
        CollectionsName.locationPoints
      );
      const snapshot = await collection.where("type", "==", type).get();

      const locationPoints: LocationPoint[] = [];
      snapshot.forEach((doc) => {
        locationPoints.push(LocationPoint.fromJson(doc.data(), doc.id));
      });

      return locationPoints;
    } catch (error) {
      console.error("Error getting location points by type:", error);
      throw error;
    }
  }

  // Get location points by entity ID
  async getLocationPointsByEntityId(
    entityId: string
  ): Promise<LocationPoint[]> {
    try {
      const collection = this.getCollectionReference(
        CollectionsName.locationPoints
      );
      const snapshot = await collection.where("entityId", "==", entityId).get();

      const locationPoints: LocationPoint[] = [];
      snapshot.forEach((doc) => {
        locationPoints.push(LocationPoint.fromJson(doc.data(), doc.id));
      });

      return locationPoints;
    } catch (error) {
      console.error("Error getting location points by entity ID:", error);
      throw error;
    }
  }

  // Get active location points
  async getActiveLocationPoints(): Promise<LocationPoint[]> {
    try {
      const collection = this.getCollectionReference(
        CollectionsName.locationPoints
      );
      const snapshot = await collection.where("isActive", "==", true).get();

      const locationPoints: LocationPoint[] = [];
      snapshot.forEach((doc) => {
        locationPoints.push(LocationPoint.fromJson(doc.data(), doc.id));
      });

      return locationPoints;
    } catch (error) {
      console.error("Error getting active location points:", error);
      throw error;
    }
  }

  // Get nearby location points within a radius
  async getNearbyLocationPoints(
    latitude: number,
    longitude: number,
    radiusKm = 10
  ): Promise<LocationPoint[]> {
    try {
      // Note: For production, consider using Firestore geoqueries or a more efficient solution
      const allLocationPoints = await this.getActiveLocationPoints();

      const nearbyPoints = allLocationPoints.filter((point) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          point.location.latitude,
          point.location.longitude
        );
        return distance <= radiusKm;
      });

      // Sort by distance
      nearbyPoints.sort((a, b) => {
        const distanceA = this.calculateDistance(
          latitude,
          longitude,
          a.location.latitude,
          a.location.longitude
        );
        const distanceB = this.calculateDistance(
          latitude,
          longitude,
          b.location.latitude,
          b.location.longitude
        );
        return distanceA - distanceB;
      });

      return nearbyPoints;
    } catch (error) {
      console.error("Error getting nearby location points:", error);
      throw error;
    }
  }

  // Toggle active status
  async toggleActiveStatus(id: string): Promise<void> {
    try {
      const locationPoint = await this.getLocationPointById(id);
      if (!locationPoint) {
        throw new Error("Location point not found");
      }

      await this.updateLocationPoint(id, {
        isActive: !locationPoint.isActive,
      });
    } catch (error) {
      console.error("Error toggling active status:", error);
      throw error;
    }
  }

  // Update location coordinates
  async updateLocationCoordinates(
    id: string,
    latitude: number,
    longitude: number,
    address?: string
  ): Promise<void> {
    try {
      const updateData: any = {
        "location.latitude": latitude,
        "location.longitude": longitude,
        lastUpdated: new Date().toISOString(),
      };

      if (address) {
        updateData["location.address"] = address;
      }

      await this.update(CollectionsName.locationPoints, id, updateData);
    } catch (error) {
      console.error("Error updating location coordinates:", error);
      throw error;
    }
  }

  // Bulk delete location points by entity ID
  async deleteLocationPointsByEntityId(entityId: string): Promise<void> {
    try {
      const locationPoints = await this.getLocationPointsByEntityId(entityId);
      const batch = this.createBatch();

      locationPoints.forEach((point) => {
        const docRef = this.getDocumentReference(
          CollectionsName.locationPoints,
          point.locationId
        );
        batch.delete(docRef);
      });

      await batch.commit();
    } catch (error) {
      console.error("Error bulk deleting location points:", error);
      throw error;
    }
  }

  // Helper method to calculate distance between two coordinates
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
