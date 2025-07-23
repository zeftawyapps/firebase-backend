import { ShopModel } from "../../data/db/model";
import { ShopRepo } from "./repo";

export class ShopService {
  shopRepo: ShopRepo;

  constructor() {
    this.shopRepo = new ShopRepo();
  }

  // Create shop profile
  async createShop(uid: string, shopData: ShopModel) {
    // Additional business logic can be added here
    // For example, validate business license, check duplicate names, etc.
    return await this.shopRepo.createShop(uid, shopData);
  }

  // Update shop information
  async updateShop(uid: string, shopData: any) {
    await this.shopRepo.updateShop(uid, shopData);
  }

  // Get shop profile
  async getShopProfile(uid: string) {
    return await this.shopRepo.getShopProfile(uid);
  }

  // Get shop by ID
  async getShopById(shopId: string) {
    return await this.shopRepo.getShopById(shopId);
  }

  // Get nearby shops
  // async getNearbyShops(location: any, radiusKm = 10) {
  //   return await this.shopRepo.getNearbyShops(location, radiusKm);
  // }

  // Get all active shops
  async getAllActiveShops() {
    return await this.shopRepo.getAllActiveShops();
  }

  // Toggle shop active status
  async toggleShopStatus(uid: string, isActive: boolean) {
    await this.shopRepo.toggleShopStatus(uid, isActive);
  }

  // Update shop location
  async updateShopLocation(uid: string, location: any, address: string) {
    await this.shopRepo.updateShopLocation(uid, location, address);
  }

  // Additional business logic methods

  // Check if shop is active and accepting orders
  async isShopAcceptingOrders(shopId: string): Promise<boolean> {
    try {
      const shop = await this.shopRepo.getShopById(shopId);
      return shop.isActive;
    } catch (error) {
      return false;
    }
  }

  // Get shop statistics
  async getShopStats(uid: string) {
    const shop = await this.shopRepo.getShopProfile(uid);
    return {
      id: shop.id,
      name: shop.name,
      isActive: shop.isActive,
      createdAt: shop.createdAt,
      location: shop.location,
    };
  }

  // Search shops by name
  async searchShopsByName(searchTerm: string) {
    try {
      // Simple search implementation
      // In production, you might want to use Algolia or Elasticsearch
      const allShops = await this.shopRepo.getAllActiveShops();
      return allShops.filter((shop) =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.log("Error searching shops:", error);
      throw error;
    }
  }
}
