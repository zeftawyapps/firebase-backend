import * as functions from "firebase-functions";
import { TriggerController } from "../app/triggers-data/contraller";

export const OrderTrigger = functions
  // .runWith({
  //     timeoutSeconds: 60,
  //     memory: '1GB',
  //     minInstances: 2,
  //     maxInstances: 10,
  // })

  .region("europe-west3")
  .firestore.document("/usersAccountData/{userAccountId}")
  .onWrite(async (snapshot, context) => {
    const usersController = new TriggerController();
    return usersController.onUsersRulesChangedTrigger(
      snapshot,
      context.params.userAccountId
    );
  });
