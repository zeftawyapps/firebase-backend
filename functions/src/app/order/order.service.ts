import { OrderReposatory } from "./order.repo";
// import { OperationProductRepo } from "../opration-data/prodect-opartion.repo";
// import { OrderProductsReposatory } from "./orderProducts.repo";
// import { ProductDataMovementRepo } from "../opration-data/product-data-movement.repo";
import { OrderStatus } from "../../data_moleds/orders.model";
import { BadRequestException } from "../../exception/bad-request.exception";

export class OrderService {
  private orderRepo: OrderReposatory;
  // private products: OperationProductRepo;
  // private prodcutsOrder: OrderProductsReposatory;
  // private productMovment: ProductDataMovementRepo;

  constructor() {
    this.orderRepo = new OrderReposatory();
    // this.products = new OperationProductRepo();
    // this.prodcutsOrder = new OrderProductsReposatory();
    // this.productMovment = new ProductDataMovementRepo();
  }

  async createOrder(data: any) {
    try {
      // Generate order ID
      const orderNumbers: number = Math.floor(Math.random() * 10000);
      const orderId: string = "ord_" + orderNumbers + new Date().getTime();

      // Calculate total
      let total = 0;
      data.items.forEach((item: any) => {
        total += item.unitPrice * item.quantity;
      });

      // Build order data
      // const orderData = {
      //   shopId,
      //   senderDetails,
      //   recipientDetails,
      //   items,
      //   orderNumber: orderId,
      //   status: OrderStatus.PENDING,
      //   total,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // };

      const status = OrderStatus.PENDING;
      data.status = status;
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.total = total; 
      await this.orderRepo.createOrder(data, orderId);
      return orderId;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // private async findProduct(id: string) {
  //   return await this.products.findProductById(id);
  // }

  async updateOrder(id: string, data: any) {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    return await this.orderRepo.updateOrder(id, updateData);
  }

  async deleteOrder(id: string) {
    return await this.orderRepo.deleteOrder(id);
  }

  async getOrders() {
    return await this.orderRepo.getOrders();
  }

  async getSingleOrder() {
    return await this.orderRepo.getSingleOrder();
  }

  // New methods for enhanced functionality
  async getOrdersWithFilters(filters: any) {
    try {
      return await this.orderRepo.getOrdersWithFilters(filters);
    } catch (error) {
      console.log("Error getting filtered orders:", error);
      throw error;
    }
  }

  async getSingleOrderById(id: string, userId?: string) {
    try {
      const order = await this.orderRepo.getOrderById(id);

      // Add authorization check if userId is provided
      if (userId && order && order.userId !== userId) {
        throw new BadRequestException("Unauthorized to access this order");
      }

      return order;
    } catch (error) {
      console.log("Error getting single order:", error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, updateData: any) {
    try {
      // Validate status transition logic
      console.log("Validating status transition:", updateData);

      const currentOrder = await this.orderRepo.getOrderById(id);
      if (!currentOrder) {
        throw new BadRequestException("Order not found");
      }

      const validTransitions = this.getValidStatusTransitions(
        currentOrder.status
      );
      if (!validTransitions.includes(updateData.status)) {
        throw new BadRequestException(
          `Cannot transition from ${currentOrder.status} to ${updateData.status}`
        );
      }

      // Add appropriate timestamps based on status
      const enhancedUpdateData = {
        ...updateData,
        updatedAt: new Date(),
      };

      // Add specific timestamps for each status
      switch (updateData.status) {
        case OrderStatus.ACCEPTED:
          enhancedUpdateData.acceptedAt = new Date();
          break;
        case OrderStatus.PICKED_UP:
          enhancedUpdateData.pickedUpAt = new Date();
          break;
        case OrderStatus.IN_TRANSIT:
          enhancedUpdateData.inTransitAt = new Date();
          break;
        case OrderStatus.DELIVERED:
          enhancedUpdateData.deliveredAt = new Date();
          break;
        case OrderStatus.CANCELLED:
        case OrderStatus.REJECTED:
          enhancedUpdateData.cancelledAt = new Date();
          if (!enhancedUpdateData.cancellationReason) {
            enhancedUpdateData.cancellationReason = "No reason provided";
          }
          break;
      }

      const result = await this.orderRepo.updateOrder(id, enhancedUpdateData);
      
      // Log status change for audit trail
      console.log(`Order ${id} status changed from ${currentOrder.status} to ${updateData.status}`);
      
      return result;
    } catch (error) {
      console.log("Error updating order status:", error);
      throw error;
    }
  }

  async acceptOrder(id: string, driverId: string) {
    try {
      const order = await this.orderRepo.getOrderById(id);
      if (!order) {
        throw new BadRequestException("Order not found");
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException(
          "Order cannot be accepted in current status"
        );
      }

      const updateData = {
        status: OrderStatus.ACCEPTED,
        driverId: driverId,
        acceptedAt: new Date(),
        updatedAt: new Date(),
      };

      return await this.orderRepo.updateOrder(id, updateData);
    } catch (error) {
      console.log("Error accepting order:", error);
      throw error;
    }
  }

  async pickupOrder(id: string, driverId: string) {
    try {
      const order = await this.orderRepo.getOrderById(id);
      if (!order) {
        throw new BadRequestException("Order not found");
      }

      if (
        order.status !== OrderStatus.ACCEPTED ||
        order.driverId !== driverId
      ) {
        throw new BadRequestException(
          "Order cannot be picked up by this driver"
        );
      }

      const updateData = {
        status: OrderStatus.PICKED_UP,
        pickedUpAt: new Date(),
        updatedAt: new Date(),
      };

      return await this.orderRepo.updateOrder(id, updateData);
    } catch (error) {
      console.log("Error picking up order:", error);
      throw error;
    }
  }

  async deliverOrder(id: string, driverId: string) {
    try {
      const order = await this.orderRepo.getOrderById(id);
      if (!order) {
        throw new BadRequestException("Order not found");
      }

      if (
        (order.status !== OrderStatus.PICKED_UP &&
          order.status !== OrderStatus.IN_TRANSIT) ||
        order.driverId !== driverId
      ) {
        throw new BadRequestException(
          "Order cannot be delivered by this driver"
        );
      }

      const updateData = {
        status: OrderStatus.DELIVERED,
        deliveredAt: new Date(),
        updatedAt: new Date(),
      };

      return await this.orderRepo.updateOrder(id, updateData);
    } catch (error) {
      console.log("Error delivering order:", error);
      throw error;
    }
  }

  async cancelOrder(id: string, userId: string, reason: string) {
    try {
      const order = await this.orderRepo.getOrderById(id);
      if (!order) {
        throw new BadRequestException("Order not found");
      }

      if (
        order.status === OrderStatus.DELIVERED ||
        order.status === OrderStatus.CANCELLED
      ) {
        throw new BadRequestException("Order cannot be cancelled");
      }

      const updateData = {
        status: OrderStatus.CANCELLED,
        cancellationReason: reason,
        cancelledBy: userId,
        cancelledAt: new Date(),
        updatedAt: new Date(),
      };

      return await this.orderRepo.updateOrder(id, updateData);
    } catch (error) {
      console.log("Error cancelling order:", error);
      throw error;
    }
  }

  async getDriverOrders(driverId: string, status?: string) {
    try {
      const filters = {
        driverId: driverId,
        status: status,
      };
      return await this.orderRepo.getOrdersWithFilters(filters);
    } catch (error) {
      console.log("Error getting driver orders:", error);
      throw error;
    }
  }

  async getShopOrders(shopId: string, status?: string) {
    try {
      const filters = {
        shopId: shopId,
        status: status,
      };
      return await this.orderRepo.getOrdersWithFilters(filters);
    } catch (error) {
      console.log("Error getting shop orders:", error);
      throw error;
    }
  }

  private getValidStatusTransitions(currentStatus: OrderStatus): OrderStatus[] {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [
        OrderStatus.ACCEPTED,
        OrderStatus.CANCELLED,
        OrderStatus.REJECTED,
      ],
      [OrderStatus.ACCEPTED]: [OrderStatus.PICKED_UP, OrderStatus.CANCELLED],
      [OrderStatus.PICKED_UP]: [OrderStatus.IN_TRANSIT, OrderStatus.DELIVERED],
      [OrderStatus.IN_TRANSIT]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [], // Terminal state
      [OrderStatus.CANCELLED]: [], // Terminal state
      [OrderStatus.REJECTED]: [], // Terminal state
    };

    return transitions[currentStatus] || [];
  }
}
