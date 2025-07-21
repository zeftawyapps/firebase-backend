import * as functions from "firebase-functions";
import { TriggerController } from "../app/triggers-data/contraller";

export const ProductTrigger = functions
  // .runWith({
  //     timeoutSeconds: 60,
  //     memory: '1GB',
  //     minInstances: 2,
  //     maxInstances: 10,
  // })

  .region("europe-west3")
  .firestore.document("/category/{categoryId}/product/{productId}")
  .onWrite(async (snapshot, context) => {
    const chatController = new TriggerController();
    return chatController.onWriteProductTrigger(
      snapshot,
      context.params.categoryId,
      context.params.productId
    );
  });
