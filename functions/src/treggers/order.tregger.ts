import * as functions from "firebase-functions";
import { TriggerController } from "../app/triggers-data/contraller";
import { CollectionsName } from "../constant/utils-consts/collection";
import { OrderStatus } from "../data_moleds/orders.model";

export const OrderTrigger = functions
  // .runWith({
  //     timeoutSeconds: 60,
  //     memory: '1GB',
  //     minInstances: 2,
  //     maxInstances: 10,
  // })
  .region("europe-west3")
  .firestore.document(`/${CollectionsName.order}/{${CollectionsName.order}Id}`)
  .onWrite(async (snapshot, context) => {
    const orderController = new TriggerController();

    // Get the before and after data
    const beforeData = snapshot.before.exists ? snapshot.before.data() : null;
    const afterData = snapshot.after.exists ? snapshot.after.data() : null;
    const orderId = context.params.orderId;

    // Handle different trigger scenarios
    if (!beforeData && afterData) {
      // Order created
      console.log(`Order ${orderId} created with status: ${afterData.status}`);
      return orderController.onOrderCreated(snapshot.after, orderId);
    } else if (beforeData && !afterData) {
      // Order deleted
      console.log(`Order ${orderId} deleted`);
      return orderController.onOrderDeleted(beforeData, orderId);
    } else if (beforeData && afterData) {
      // Order updated
      const statusChanged = beforeData.status !== afterData.status;

      if (statusChanged) {
        console.log(
          `Order ${orderId} status changed from ${beforeData.status} to ${afterData.status}`
        );
        return orderController.onOrderStatusChanged(
          snapshot,
          orderId,
          beforeData.status,
          afterData.status
        );
      } else {
        // Other field updates
        console.log(`Order ${orderId} updated (non-status change)`);
        return orderController.onOrderUpdated(snapshot, orderId);
      }
    }

    // Fallback to original trigger for backward compatibility
    return orderController.onOrderStatusChangedTrigger(snapshot, orderId);
  });

// Additional trigger for order status-specific actions
export const OrderStatusTrigger = functions
  .region("europe-west3")
  .firestore.document(`/${CollectionsName.order}/{${CollectionsName.order}Id}`)
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const orderId = context.params.orderId;

    // Only proceed if status actually changed
    if (beforeData.status === afterData.status) {
      return null;
    }

    const orderController = new TriggerController();

    try {
      // Handle specific status transitions
      switch (afterData.status) {
        case OrderStatus.ACCEPTED:
          return await orderController.onOrderAccepted(change.after, orderId);

        case OrderStatus.PICKED_UP:
          return await orderController.onOrderPickedUp(change.after, orderId);

        case OrderStatus.IN_TRANSIT:
          return await orderController.onOrderInTransit(change.after, orderId);

        case OrderStatus.DELIVERED:
          return await orderController.onOrderDelivered(change.after, orderId);

        case OrderStatus.CANCELLED:
          return await orderController.onOrderCancelled(change.after, orderId);

        case OrderStatus.REJECTED:
          return await orderController.onOrderRejected(change.after, orderId);

        default:
          console.log(`Unhandled order status: ${afterData.status}`);
          return null;
      }
    } catch (error) {
      console.error(
        `Error processing order status change for ${orderId}:`,
        error
      );
      throw error;
    }
  });
