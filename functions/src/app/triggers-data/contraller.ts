import { CollectionsName } from "../../constant/utils-consts/collection";
import { orderStatus } from "../../constant/utils-consts/order-constant";
import { OperationsProductService } from "./service";
import { DriverService } from "../driver/service";
import { ShopService } from "../shop/service";
import { LocationPointService } from "../location-point/service";
import {
  DriverModel,
  DriverStatus,
  ShopModel,
  UserRole,
} from "../../data_moleds";

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

  async onWriteProductOparionsTrigger(snapshot: any, productId: string) {
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

  // Original order status changed trigger (for backward compatibility)
  async onOrderStatusChangedTrigger(snapshot: any, orderId: string) {
    const data = snapshot.after.data();
    if (data.status == orderStatus.refunded) {
      const productService = new OperationsProductService();
      const orderData = data;
      productService.addProductMovement(orderData, orderId);
    }

    return await this;
  }

  // New enhanced order triggers

  async onOrderCreated(snapshot: any, orderId: string) {
    const orderData = snapshot.data();
    console.log(`Order created: ${orderId}`, orderData);

    try {
      // Add order creation timestamp
      await snapshot.ref.update({
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Notify relevant parties (shop, potential drivers)
      await this.notifyOrderCreated(orderData, orderId);
    } catch (error) {
      console.error(`Error handling order creation for ${orderId}:`, error);
    }

    return this;
  }

  async onOrderDeleted(orderData: any, orderId: string) {
    console.log(`Order deleted: ${orderId}`, orderData);

    try {
      // Clean up any related data if needed
      await this.cleanupOrderData(orderData, orderId);
    } catch (error) {
      console.error(`Error handling order deletion for ${orderId}:`, error);
    }

    return this;
  }

  async onOrderStatusChanged(
    snapshot: any,
    orderId: string,
    oldStatus: string,
    newStatus: string
  ) {
    const orderData = snapshot.after.data();
    console.log(`Order ${orderId} status changed: ${oldStatus} → ${newStatus}`);

    try {
      // Add status change metadata
      await snapshot.after.ref.update({
        [`statusHistory.${newStatus}`]: new Date(),
        lastStatusChange: {
          from: oldStatus,
          to: newStatus,
          timestamp: new Date(),
        },
      });

      // Send notifications based on status change
      await this.notifyStatusChange(orderData, orderId, oldStatus, newStatus);
    } catch (error) {
      console.error(`Error handling status change for ${orderId}:`, error);
    }

    return this;
  }

  async onOrderUpdated(snapshot: any, orderId: string) {
    console.log(`Order updated: ${orderId}`);

    try {
      // Update the updatedAt timestamp
      await snapshot.after.ref.update({
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error(`Error handling order update for ${orderId}:`, error);
    }

    return this;
  }

  async onOrderAccepted(snapshot: any, orderId: string) {
    const orderData = snapshot.data();
    console.log(`Order accepted: ${orderId} by driver: ${orderData.driverId}`);

    try {
      // Update driver status to busy
      if (orderData.driverId) {
        const driverService = new DriverService();
        await driverService.updateStatus(orderData.driverId, DriverStatus.BUSY);
      }

      // Notify shop and customer
      await this.notifyOrderAccepted(orderData, orderId);
    } catch (error) {
      console.error(`Error handling order acceptance for ${orderId}:`, error);
    }

    return this;
  }

  async onOrderPickedUp(snapshot: any, orderId: string) {
    const orderData = snapshot.data();
    console.log(`Order picked up: ${orderId}`);

    try {
      // Notify customer and shop
      await this.notifyOrderPickedUp(orderData, orderId);
    } catch (error) {
      console.error(`Error handling order pickup for ${orderId}:`, error);
    }

    return this;
  }

  async onOrderInTransit(snapshot: any, orderId: string) {
    const orderData = snapshot.data();
    console.log(`Order in transit: ${orderId}`);

    try {
      // Start location tracking
      await this.startLocationTracking(orderData, orderId);
    } catch (error) {
      console.error(`Error handling order transit for ${orderId}:`, error);
    }

    return this;
  }

  async onOrderDelivered(snapshot: any, orderId: string) {
    const orderData = snapshot.data();
    console.log(`Order delivered: ${orderId}`);

    try {
      // Update driver status back to available
      if (orderData.driverId) {
        const driverService = new DriverService();
        await driverService.updateStatus(
          orderData.driverId,
          DriverStatus.AVAILABLE
        );
      }

      // Stop location tracking
      await this.stopLocationTracking(orderData, orderId);

      // Notify completion
      await this.notifyOrderDelivered(orderData, orderId);
    } catch (error) {
      console.error(`Error handling order delivery for ${orderId}:`, error);
    }

    return this;
  }

  async onOrderCancelled(snapshot: any, orderId: string) {
    const orderData = snapshot.data();
    console.log(
      `Order cancelled: ${orderId}, reason: ${orderData.cancellationReason}`
    );

    try {
      // Update driver status back to available if assigned
      if (orderData.driverId) {
        const driverService = new DriverService();
        await driverService.updateStatus(
          orderData.driverId,
          DriverStatus.AVAILABLE
        );
      }

      // Notify cancellation
      await this.notifyOrderCancelled(orderData, orderId);
    } catch (error) {
      console.error(`Error handling order cancellation for ${orderId}:`, error);
    }

    return this;
  }

  async onOrderRejected(snapshot: any, orderId: string) {
    const orderData = snapshot.data();
    console.log(`Order rejected: ${orderId}`);

    try {
      // Notify rejection and suggest alternatives
      await this.notifyOrderRejected(orderData, orderId);
    } catch (error) {
      console.error(`Error handling order rejection for ${orderId}:`, error);
    }

    return this;
  }

  // Helper methods for notifications and actions
  private async notifyOrderCreated(orderData: any, orderId: string) {
    // Implementation for notifying about new order
    console.log(`Notifying order creation: ${orderId}`);
    // Add notification logic here (FCM, email, etc.)
  }

  private async notifyStatusChange(
    orderData: any,
    orderId: string,
    oldStatus: string,
    newStatus: string
  ) {
    // Implementation for status change notifications
    console.log(
      `Notifying status change for order ${orderId}: ${oldStatus} → ${newStatus}`
    );
    // Add notification logic here
  }

  private async notifyOrderAccepted(orderData: any, orderId: string) {
    console.log(`Notifying order acceptance: ${orderId}`);
    // Add notification logic here
  }

  private async notifyOrderPickedUp(orderData: any, orderId: string) {
    console.log(`Notifying order pickup: ${orderId}`);
    // Add notification logic here
  }

  private async notifyOrderDelivered(orderData: any, orderId: string) {
    console.log(`Notifying order delivery: ${orderId}`);
    // Add notification logic here
  }

  private async notifyOrderCancelled(orderData: any, orderId: string) {
    console.log(`Notifying order cancellation: ${orderId}`);
    // Add notification logic here
  }

  private async notifyOrderRejected(orderData: any, orderId: string) {
    console.log(`Notifying order rejection: ${orderId}`);
    // Add notification logic here
  }

  private async startLocationTracking(orderData: any, orderId: string) {
    console.log(`Starting location tracking for order: ${orderId}`);
    // Add location tracking logic here
  }

  private async stopLocationTracking(orderData: any, orderId: string) {
    console.log(`Stopping location tracking for order: ${orderId}`);
    // Add location tracking cleanup logic here
  }

  private async cleanupOrderData(orderData: any, orderId: string) {
    console.log(`Cleaning up data for deleted order: ${orderId}`);
    // Add cleanup logic here
  }

  // on shop created
  async onShopCreatedTrigger(snapshot: any, shopId: string) {
    const data = snapshot.data();

    console.log("onShopCreatedTrigger", data, shopId);

    try {
      const locationPointService = new LocationPointService();

      // Create shop location point
      await locationPointService.createShopLocationPoint({
        shopId: shopId,
        shopName: data.name || "Shop",
        location: {
          latitude: data.location?.latitude || 0,
          longitude: data.location?.longitude || 0,
          address: data.address || "موقع افتراضي - سيتم تحديثه لاحقاً",
        },
        address: data.address || "موقع افتراضي - سيتم تحديثه لاحقاً",
        phone: data.phone || "000-000-0000",
        isActive: data.isActive !== undefined ? data.isActive : true,
      });

      console.log("Shop location point created successfully for shop:", shopId);
    } catch (error) {
      console.error(
        `Error creating shop location point for shop ${shopId}:`,
        error
      );
      // Don't throw error to prevent trigger failure
    }

    return await this;
  }

  // on shop updated
  async onShopUpdatedTrigger(snapshot: any, shopId: string) {
    const oldData = snapshot.before.data();
    const newData = snapshot.after.data();

    console.log("onShopUpdatedTrigger", newData, shopId);

    try {
      const locationPointService = new LocationPointService();

      // Check if location, name, or active status has changed
      const locationChanged =
        oldData.location?.latitude !== newData.location?.latitude ||
        oldData.location?.longitude !== newData.location?.longitude ||
        oldData.address !== newData.address;

      const nameChanged = oldData.name !== newData.name;
      const statusChanged = oldData.isActive !== newData.isActive;

      if (locationChanged || nameChanged || statusChanged) {
        const locationPointId = `shop_${shopId}`;

        // Update shop location point
        const updateData: any = {};

        if (nameChanged) {
          updateData.name = newData.name || "Shop";
        }

        if (locationChanged) {
          updateData.location = {
            latitude: newData.location?.latitude || 0,
            longitude: newData.location?.longitude || 0,
            address: newData.address || "موقع المحل",
          };
          updateData.description = newData.address || "محل";
        }

        if (statusChanged) {
          updateData.isActive = newData.isActive;
          updateData.metadata = {
            ...oldData.metadata,
            isActive: newData.isActive,
          };
        }

        await locationPointService.updateLocationPoint(
          locationPointId,
          updateData
        );

        console.log(
          "Shop location point updated successfully for shop:",
          shopId
        );
      }
    } catch (error) {
      console.error(
        `Error updating shop location point for shop ${shopId}:`,
        error
      );
      // Don't throw error to prevent trigger failure
    }

    return await this;
  }

  // on shop deleted
  async onShopDeletedTrigger(snapshot: any, shopId: string) {
    const data = snapshot.data();

    console.log("onShopDeletedTrigger", data, shopId);

    try {
      const locationPointService = new LocationPointService();

      // Delete shop location points
      await locationPointService.cleanupLocationPointsForEntity(shopId);

      console.log(
        "Shop location points deleted successfully for shop:",
        shopId
      );
    } catch (error) {
      console.error(
        `Error deleting shop location points for shop ${shopId}:`,
        error
      );
      // Don't throw error to prevent trigger failure
    }

    return await this;
  }

  // on driver created
  async onDriverCreatedTrigger(snapshot: any, driverId: string) {
    const data = snapshot.data();

    console.log("onDriverCreatedTrigger", data, driverId);

    try {
      const locationPointService = new LocationPointService();

      // Create driver location point
      await locationPointService.createDriverLocationPoint({
        driverId: driverId,
        driverName: data.name || "Driver",
        location: {
          latitude: data.currentLocation?.latitude || 30,
          longitude: data.currentLocation?.longitude || 30,
          address:
            data.currentLocation?.address ||
            "موقع افتراضي - سيتم تحديثه لاحقاً",
        },
        phone: data.phone || "000-000-0000",
        status: data.status || DriverStatus.AVAILABLE,
        rating: data.rating || 0,
      });

      console.log(
        "Driver location point created successfully for driver:",
        driverId
      );
    } catch (error) {
      console.error(
        `Error creating driver location point for driver ${driverId}:`,
        error
      );
      // Don't throw error to prevent trigger failure
    }

    return await this;
  }

  // on driver updated
  async onDriverUpdatedTrigger(snapshot: any, driverId: string) {
    const oldData = snapshot.before.data();
    const newData = snapshot.after.data();

    console.log("onDriverUpdatedTrigger", newData, driverId);

    try {
      const locationPointService = new LocationPointService();

      // Check if location or status has changed
      const locationChanged =
        oldData.currentLocation?.latitude !==
          newData.currentLocation?.latitude ||
        oldData.currentLocation?.longitude !==
          newData.currentLocation?.longitude;

      const statusChanged = oldData.status !== newData.status;

      if (locationChanged || statusChanged) {
        await locationPointService.updateDriverLocation(
          driverId,
          {
            latitude: newData.currentLocation?.latitude || 30,
            longitude: newData.currentLocation?.longitude || 30,
            address: newData.currentLocation?.address || "موقع السائق",
          },
          newData.status
        );

        console.log(
          "Driver location point updated successfully for driver:",
          driverId
        );
      }
    } catch (error) {
      console.error(
        `Error updating driver location point for driver ${driverId}:`,
        error
      );
      // Don't throw error to prevent trigger failure
    }

    return await this;
  }

  // on driver deleted
  async onDriverDeletedTrigger(snapshot: any, driverId: string) {
    const data = snapshot.data();

    console.log("onDriverDeletedTrigger", data, driverId);

    try {
      const locationPointService = new LocationPointService();

      // Delete driver location points
      await locationPointService.cleanupLocationPointsForEntity(driverId);

      console.log(
        "Driver location points deleted successfully for driver:",
        driverId
      );
    } catch (error) {
      console.error(
        `Error deleting driver location points for driver ${driverId}:`,
        error
      );
      // Don't throw error to prevent trigger failure
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
          id: usrid,
          name: newUserData.name || "New Driver",
          currentLocation: null,
          status: DriverStatus.AVAILABLE,
          rallyPoint: null,
          lastLocationUpdate: new Date(),
          rating: 0,
          isActive: true,
          createdAt: new Date(),
          email: newUserData.email || "",
          phone: newUserData.phone || "000-000-0000",
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
