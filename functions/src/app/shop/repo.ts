import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../util/base.repository";
import { ShopModel } from "../../data_moleds";

export class ShopRepo extends BaseRepository {
  // Create shop profile
  async createShop(uid: string, shopData: ShopModel) {
    try {
      const collection = this.getCollectionReference(CollectionsName.shops);
      const docRef = collection.doc(uid);

      const shop = new ShopModel({
        id: uid,
        ownerId: uid,
        name: shopData.name,
        address: shopData.address,
        location: shopData.location,
        phone: shopData.phone,
        email: shopData.email,
        createdAt: new Date(),
        isActive: true,
      });

      await docRef.set({
        ...shop.toJson(),
        uid: uid, // Link to user auth
        createdAt: new Date().toISOString(),
      });

      return docRef.id;
    } catch (error) {
      console.log("Error creating shop:", error);
      throw error;
    }
  }

  // Update shop information
  async updateShop(uid: string, shopData: any) {
    try {
      const shopDoc = await this.getShopByUid(uid);
      if (!shopDoc.exists) {
        throw new Error("Shop not found");
      }

      const collection = this.getCollectionReference(CollectionsName.shops);
      await collection.doc(shopDoc.id).update({
        name: shopData.name,
        phone: shopData.phone,
        email: shopData.email,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.log("Error updating shop:", error);
      throw error;
    }
  }

  async updateShopLogIn(uid: string, shopData: any) {
    try {
      const shopDoc = await this.getShopByUid(uid);
      if (!shopDoc.exists) {
        throw new Error("Shop not found");
      }
      this.update(CollectionsName.shops, shopDoc.id, {
        notificationToken: shopData.notificationToken,
      });
    } catch (error) {
      console.log("Error updating shop:", error);
      throw error;
    }
  }

  // Get shop by uid
  async getShopByUid(uid: string) {
    const shops = await this.getCollectionReference(CollectionsName.shops)
      .where("uid", "==", uid)
      .get();

    return shops.docs[0];
  }

  // Get shop profile
  async getShopProfile(uid: string) {
    try {
      const shopDoc = await this.getShopByUid(uid);
      if (!shopDoc.exists) {
        throw new Error("Shop not found");
      }

      return ShopModel.fromFirestore(shopDoc);
    } catch (error) {
      console.log("Error getting shop profile:", error);
      throw error;
    }
  }

  // Get shop by ID
  async getShopById(shopId: string) {
    try {
      // const shopDoc = await this.getCollectionReference(CollectionsName.shops)
      //   .doc(shopId)
      //   .get();

      // if (!shopDoc.exists) {
      //   throw new Error("Shop not found");
      // }
      const shop = await this.getDocumentReference(
        CollectionsName.shops,
        shopId
      ).get();
      const data = shop.data();
      return data;
    } catch (error) {
      console.log("Error getting shop by ID:", error);
      throw error;
    }
  }

  // Get nearby shops (simplified - in production you'd use geohash or GeoFirestore)
  // async getNearbyShops(location: any, radiusKm = 10) {
  //   try {
  //     // Simple implementation - in production use proper geospatial queries
  //     const shops = await this.getCollectionReference(CollectionsName.shops)
  //       .where("isActive", "==", true)
  //       .get();

  //     const nearbyShops = shops.docs
  //       .map((doc) => ShopModel.fromFirestore(doc))
  //       .filter((shop) => {
  //         // Simple distance calculation (not accurate for production)
  //         const distance = this.calculateDistance(
  //           location.latitude,
  //           location.longitude,
  //           shop.location.latitude,
  //           shop.location.longitude
  //         );
  //         return distance <= radiusKm;
  //       });

  //     return nearbyShops;
  //   } catch (error) {
  //     console.log("Error getting nearby shops:", error);
  //     throw error;
  //   }
  // }

  // Get all active shops
  async getAllActiveShops() {
    try {
      const shops = await this.getCollectionReference(CollectionsName.shops)
        .where("isActive", "==", true)
        .get();

      return shops.docs.map((doc) => ShopModel.fromFirestore(doc));
    } catch (error) {
      console.log("Error getting active shops:", error);
      throw error;
    }
  }

  // Toggle shop active status
  async toggleShopStatus(uid: string, isActive: boolean) {
    try {
      const shopDoc = await this.getShopByUid(uid);
      if (!shopDoc.exists) {
        throw new Error("Shop not found");
      }

      const collection = this.getCollectionReference(CollectionsName.shops);
      await collection.doc(shopDoc.id).update({
        isActive: isActive,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.log("Error toggling shop status:", error);
      throw error;
    }
  }

  // Update shop location
  async updateShopLocation(uid: string, location: any, address: string) {
    try {
      const shopDoc = await this.getShopByUid(uid);
      if (!shopDoc.exists) {
        throw new Error("Shop not found");
      }

      const collection = this.getCollectionReference(CollectionsName.shops);
      await collection.doc(shopDoc.id).update({
        location: location,
        address: address,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.log("Error updating shop location:", error);
      throw error;
    }
  }

  // // Simple distance calculation (Haversine formula)
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
}
