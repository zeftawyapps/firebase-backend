import * as functions from "firebase-functions";
import { TriggerController } from "../app/triggers-data/contraller";
import { CollectionsName } from "../constant/utils-consts/collection";

// Shop created trigger
export const shopCreatedTrigger = functions
  .region("europe-west3")
  .firestore.document(`/${CollectionsName.shops}/{${CollectionsName.shops}Id}`)
  .onCreate(async (data, context) => {
    const triggerController = new TriggerController();
    return triggerController.onShopCreatedTrigger(
      data,

      context.params[`${CollectionsName.shops}Id`]
    );
  });

// Shop updated trigger
export const shopUpdatedTrigger = functions
  .region("europe-west3")
  .firestore.document(`/${CollectionsName.shops}/{${CollectionsName.shops}Id}`)
  .onUpdate(async (snapshot, context) => {
    const triggerController = new TriggerController();
    return triggerController.onShopUpdatedTrigger(
      snapshot,
      context.params[`${CollectionsName.shops}Id`]
    );
  });

// Shop deleted trigger
export const shopDeletedTrigger = functions
  .region("europe-west3")
  .firestore.document(`/${CollectionsName.shops}/{${CollectionsName.shops}Id}`)
  .onDelete(async (snapshot, context) => {
    const triggerController = new TriggerController();
    return triggerController.onShopDeletedTrigger(
      snapshot,
      context.params[`${CollectionsName.shops}Id`]
    );
  });
