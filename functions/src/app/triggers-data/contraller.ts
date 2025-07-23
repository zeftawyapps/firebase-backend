import { CollectionsName } from "../../constant/utils-consts/collection";
import { orderStatus } from "../../constant/utils-consts/order-constant";
import { OperationsProductService } from "./service";
import { DriverService } from "../driver/service";
import { ShopService } from "../shop/service";
import {
  DriverModel,
  DriverStatus,
  ShopModel,
  UserRole,
} from "../../data/db/model";

export class TriggerController {
  async onWriteProductTrigger(snapshot: any, catId: string, productId: string) {
    const data = snapshot.after.data();
    const productService = new OperationsProductService();
    const inputData = {
      datPath: `${CollectionsName.category}/${catId}/${CollectionsName.product}/${productId}`,
      ...data,
    };

    await productService.createProductData(productId, inputData);
    console.log("onWriteProductTrigger", data, productId, catId);
    return await this;
  }
  async onWriteProductOparionsTrigger(
    snapshot: any,

    productId: string
  ) {
    const data = snapshot.after.data();
    const productService = new OperationsProductService();
    const inputData = {
      name: data.name,
      balacne: 0,
      addings: 0,
      declines: 0,
    };

    await productService.createProductBalancerData(productId, inputData);

    console.log("onWriteProductOpartionsTrigger", data, productId);

    return await this;
  }

  // on order status changed
  async onOrderStatusChangedTrigger(snapshot: any, orderId: string) {
    const data = snapshot.after.data();
    if (data.status == orderStatus.refunded) {
      const productService = new OperationsProductService();
      const orderData = data;
      productService.addProductMovement(orderData, orderId);
    }

    return await this;
  }

  async onUsersRulesChangedTrigger(snapshot: any, userId: string) {
    const oldUserData = snapshot.before.data();
    const newUserData = snapshot.after.data();

    console.log("onUsersRulesChangedTrigger oldUserData", oldUserData, userId);
    console.log("onUsersRulesChangedTrigger newUserData", newUserData, userId);

    const usrid = userId || newUserData?.uid || oldUserData?.uid;
    const oldRole = oldUserData?.role;
    const newRole = newUserData?.role;

    // Check if role has changed
    if (oldRole !== newRole) {
      console.log(
        `User role changed from ${oldRole} to ${newRole} for user ${userId}`
      );

      try {
        // First, handle deletion of old role profiles
        await this.deleteOldRoleProfile(oldRole, usrid, userId);

        // Then, create new role profile
        await this.createNewRoleProfile(newRole, newUserData, usrid, userId);
      } catch (error) {
        console.error(`Error handling role change for user ${userId}:`, error);
        // Don't throw error to prevent trigger failure
      }
    }

    return await this;
  }

  private async deleteOldRoleProfile(
    oldRole: string,
    usrid: string,
    userId: string
  ) {
    if (!oldRole) return;

    try {
      if (oldRole === UserRole.DRIVER) {
        console.log("Deleting old driver profile for user:", userId);
        const driverService = new DriverService();
        await driverService.driverRepo.delete(CollectionsName.drivers, usrid);
        console.log("Driver profile deleted successfully for user:", userId);
      }

      if (oldRole === UserRole.SHOP_OWNER) {
        console.log("Deleting old shop profile for user:", userId);
        const shopService = new ShopService();
        await shopService.shopRepo.delete(CollectionsName.shops, usrid);
        console.log("Shop profile deleted successfully for user:", userId);
      }
    } catch (error) {
      console.error(
        `Error deleting old role profile for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  private async createNewRoleProfile(
    newRole: string,
    newUserData: any,
    usrid: string,
    userId: string
  ) {
    if (!newRole) return;

    try {
      if (newRole === UserRole.DRIVER) {
        console.log("Creating driver profile for user:", userId);
        const driverService = new DriverService();

        const defaultDriverData = new DriverModel({
          name: newUserData.name || "New Driver",
          id: usrid,
          currentLocation: null,
          status: DriverStatus.AVAILABLE,
          rallyPoint: null,
          lastLocationUpdate: new Date(),
          rating: 0,
        });

        await driverService.createDriver(usrid, defaultDriverData);
        console.log("Driver profile created successfully for user:", userId);
      }

      if (newRole === UserRole.SHOP_OWNER) {
        console.log("Creating shop profile for user:", userId);
        const shopService = new ShopService();

        const defaultShopData = new ShopModel({
          id: usrid,
          ownerId: usrid,
          name: newUserData.name || "New Shop",
          address: "",
          isActive: true,
          createdAt: new Date(),
          location: null,
          phone: newUserData.phone || "000-000-0000",
          email: newUserData.email || "",
        });

        await shopService.createShop(usrid, defaultShopData);
        console.log("Shop profile created successfully for user:", userId);
      }
    } catch (error) {
      console.error(
        `Error creating new role profile for user ${userId}:`,
        error
      );
      throw error;
    }
  }
}
