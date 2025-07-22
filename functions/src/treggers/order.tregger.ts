import * as functions from "firebase-functions";
import { TriggerController } from "../app/triggers-data/contraller";
import { CollectionsName } from "../constant/utils-consts/collection";

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
    return orderController.onOrderStatusChangedTrigger(
      snapshot,
      context.params.orderId
    );
  });
