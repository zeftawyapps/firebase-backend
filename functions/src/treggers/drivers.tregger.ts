import * as functions from "firebase-functions";
import { TriggerController } from "../app/triggers-data/contraller";
import { CollectionsName } from "../constant/utils-consts/collection";

// Driver created trigger
export const driverCreatedTrigger = functions
  .region("europe-west3")
  .firestore.document(
    `/${CollectionsName.drivers}/{${CollectionsName.drivers}Id}`
  )
  .onCreate(async (snapshot, context) => {
    const triggerController = new TriggerController();
    return triggerController.onDriverCreatedTrigger(
      snapshot,
      context.params[`${CollectionsName.drivers}Id`]
    );
  });

// Driver updated trigger
export const driverUpdatedTrigger = functions
  .region("europe-west3")
  .firestore.document(
    `/${CollectionsName.drivers}/{${CollectionsName.drivers}Id}`
  )
  .onUpdate(async (snapshot, context) => {
    const triggerController = new TriggerController();
    return triggerController.onDriverUpdatedTrigger(
      snapshot,
      context.params[`${CollectionsName.drivers}Id`]
    );
  });

// Driver deleted trigger
export const driverDeletedTrigger = functions
  .region("europe-west3")
  .firestore.document(
    `/${CollectionsName.drivers}/{${CollectionsName.drivers}Id}`
  )
  .onDelete(async (snapshot, context) => {
    const triggerController = new TriggerController();
    return triggerController.onDriverDeletedTrigger(
      snapshot,
      context.params[`${CollectionsName.drivers}Id`]
    );
  });
