import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../util/base.repository";
import { DriverModel, DriverStatus } from "../../data_moleds";

export class DriverRepo extends BaseRepository {
  // Create driver profile
  async createDriver(uid: string, driverData: DriverModel): Promise<string> {
    try {
      const collection = this.getCollectionReference(CollectionsName.drivers);
      const docRef = collection.doc(uid); // Use uid as document ID

      const drive = new DriverModel({
        ...driverData,
        id: uid, // Use uid as driver ID
        currentLocation: null, // Default to null
        // Default rating
      });

      await docRef.set({
        ...drive.toJson(),
        uid: uid, // Link to user auth
        createdAt: new Date().toISOString(),
      });

      return docRef.id;
    } catch (error) {
      console.log("Error creating driver:", error);
      throw error;
    }
  }

  // Update driver location
  async updateLocation(uid: string, location: any) {
    try {
      const driverDoc = await this.getDriverByUid(uid);
      if (!driverDoc.exists) {
        throw new Error("Driver not found");
      }

      const collection = this.getCollectionReference(CollectionsName.drivers);
      await collection.doc(driverDoc.id).update({
        currentLocation: location,
        lastLocationUpdate: new Date().toISOString(),
      });
    } catch (error) {
      console.log("Error updating location:", error);
      throw error;
    }
  }

  // Update driver status
  async updateStatus(uid: string, status: DriverStatus) {
    try {
      const driverDoc = await this.getDriverByUid(uid);
      if (!driverDoc.exists) {
        throw new Error("Driver not found");
      }

      const collection = this.getCollectionReference(CollectionsName.drivers);
      await collection.doc(driverDoc.id).update({
        status: status,
      });
    } catch (error) {
      console.log("Error updating status:", error);
      throw error;
    }
  }

  async getDriverById(driverId: string) {
    try {
      const driverDoc = await this.getDocumentReference(
        CollectionsName.drivers,
        driverId
      ).get();
      const data = driverDoc.data();
      return data;
    } catch (error) {
      console.log("Error getting driver by ID:", error);
      throw error;
    }
  }

  // Get driver by uid
  async getDriverByUid(uid: string) {
    const drivers = await this.getCollectionReference(CollectionsName.drivers)
      .where("uid", "==", uid)
      .get();

    return drivers.docs[0];
  }

  // Get driver profile
  async getDriverProfile(uid: string) {
    try {
      const driverDoc = await this.getDriverByUid(uid);
      if (!driverDoc.exists) {
        throw new Error("Driver not found");
      }

      return DriverModel.fromFirestore(driverDoc);
    } catch (error) {
      console.log("Error getting driver profile:", error);
      throw error;
    }
  }

  // Get nearby drivers (simplified - in production you'd use geohash or GeoFirestore)
  // async getNearbyDrivers(location: any, radiusKm = 5) {
  //   try {
  //     // Simple implementation - in production use proper geospatial queries
  //     const drivers = await this.getCollectionReference(CollectionsName.drivers)
  //       .where("status", "==", DriverStatus.AVAILABLE)
  //       .get();

  //     const nearbyDrivers = drivers.docs
  //       .map((doc) => DriverModel.fromFirestore(doc))
  //       .filter((driver) => {
  //         // Simple distance calculation (not accurate for production)
  //         const distance = this.calculateDistance(
  //           location.latitude,
  //           location.longitude,
  //           driver.currentLocation.latitude,
  //           driver.currentLocation.longitude
  //         );
  //         return distance <= radiusKm;
  //       });

  //     return nearbyDrivers;
  //   } catch (error) {
  //     console.log("Error getting nearby drivers:", error);
  //     throw error;
  //   }
  // }

  // Set rally point
  async setRallyPoint(uid: string, rallyPoint: any) {
    try {
      const driverDoc = await this.getDriverByUid(uid);
      if (!driverDoc.exists) {
        throw new Error("Driver not found");
      }

      const collection = this.getCollectionReference(CollectionsName.drivers);
      await collection.doc(driverDoc.id).update({
        rallyPoint: rallyPoint,
      });
    } catch (error) {
      console.log("Error setting rally point:", error);
      throw error;
    }
  }

  // Update driver rating
  async updateRating(driverId: string, rating: number) {
    try {
      const collection = this.getCollectionReference(CollectionsName.drivers);
      await collection.doc(driverId).update({
        rating: rating,
      });
    } catch (error) {
      console.log("Error updating rating:", error);
      throw error;
    }
  }

  async updateDriverLogIn(uid: string, driverData: any) {
    try {
      const driverDoc = await this.getDriverByUid(uid);
      if (!driverDoc.exists) {
        throw new Error("Driver not found");
      }
      await this.update(CollectionsName.drivers, driverDoc.id, {
        notificationToken: driverData,
      });
    } catch (error) {
      console.log("Error updating driver login:", error);
      throw error;
    }
  }

  // Simple distance calculation (Haversine formula)
  // private calculateDistance(
  //   lat1: number,
  //   lon1: number,
  //   lat2: number,
  //   lon2: number
  // ): number {
  //   const R = 6371; // Earth's radius in kilometers
  //   const dLat = this.deg2rad(lat2 - lat1);
  //   const dLon = this.deg2rad(lon2 - lon1);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(this.deg2rad(lat1)) *
  //       Math.cos(this.deg2rad(lat2)) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   const distance = R * c;
  //   return distance;
  // }

  // private deg2rad(deg: number): number {
  //   return deg * (Math.PI / 180);
  // }

  // Delete driver by UID
  async deleteDriver(uid: string): Promise<void> {
    try {
      const driverDoc = await this.getDriverByUid(uid);
      if (!driverDoc.exists) {
        throw new Error("Driver not found");
      }

      await this.delete(CollectionsName.drivers, driverDoc.id);
    } catch (error) {
      console.log("Error deleting driver:", error);
      throw error;
    }
  }

  // Get all test drivers (drivers with IDs starting with 'test_driver_')
  async getTestDrivers(): Promise<any[]> {
    try {
      const collection = this.getCollectionReference(CollectionsName.drivers);
      const snapshot = await collection.get();

      const testDrivers: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.uid && data.uid.startsWith("test_driver_")) {
          testDrivers.push({
            id: doc.id,
            uid: data.uid,
            ...data,
          });
        }
      });

      return testDrivers;
    } catch (error) {
      console.log("Error getting test drivers:", error);
      throw error;
    }
  }
}
