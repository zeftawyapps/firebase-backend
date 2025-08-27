import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../util/base.repository";

export class OrderReposatory extends BaseRepository {
  async createOrder(data: any, orderNumber: string) {
    try {
      await this.insertById(CollectionsName.order, orderNumber, data);
    } catch (error) {
      console.log("Error creating order:", error);
      throw error;
    }
  }
  async updateOrder(id: string, data: any) {
    return await this.update(CollectionsName.order, id, data);
  }

  async deleteOrder(id: string) {
    return await this.delete(CollectionsName.order, id);
  }

  async getOrders() {
    const doc = await this.getCollectionReference(CollectionsName.order).get();
    const docs = doc.docs;
    const data = docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  }

  async getSingleOrder() {
    return await this.getCollectionReference(CollectionsName.order).get();
  }

  // New enhanced methods
  async getOrderById(id: string) {
    try {
      const doc = await this.getCollectionReference(CollectionsName.order)
        .doc(id)
        .get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      } as any;
    } catch (error) {
      console.log("Error getting order by ID:", error);
      throw error;
    }
  }

  async getOrdersWithFilters(filters: any) {
    try {
      let query: any = this.getCollectionReference(CollectionsName.order);

      // Apply filters
      if (filters.userId) {
        query = query.where("userId", "==", filters.userId);
      }

      if (filters.status) {
        query = query.where("status", "==", filters.status);
      }

      if (filters.shopId) {
        query = query.where("shopId", "==", filters.shopId);
      }

      if (filters.driverId) {
        query = query.where("driverId", "==", filters.driverId);
      }

      // Apply ordering (most recent first)
      query = query.orderBy("createdAt", "desc");

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.offset(filters.offset);
      }

      const snapshot = await query.get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.log("Error getting filtered orders:", error);
      throw error;
    }
  }

  async getOrdersByStatus(status: string) {
    try {
      const snapshot = await this.getCollectionReference(CollectionsName.order)
        .where("status", "==", status)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.log("Error getting orders by status:", error);
      throw error;
    }
  }

  async getOrdersByDriver(driverId: string) {
    try {
      const snapshot = await this.getCollectionReference(CollectionsName.order)
        .where("driverId", "==", driverId)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.log("Error getting orders by driver:", error);
      throw error;
    }
  }

  async getOrdersByShop(shopId: string) {
    try {
      const snapshot = await this.getCollectionReference(CollectionsName.order)
        .where("shopId", "==", shopId)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.log("Error getting orders by shop:", error);
      throw error;
    }
  }

  async countOrdersByStatus(status: string) {
    try {
      const snapshot = await this.getCollectionReference(CollectionsName.order)
        .where("status", "==", status)
        .get();

      return snapshot.size;
    } catch (error) {
      console.log("Error counting orders by status:", error);
      throw error;
    }
  }
}
