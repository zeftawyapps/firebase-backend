import * as functions from "firebase-functions";
import { appExpress } from "./app/init";
//init app
require("./app/init");
// const productTregger = require("./treggers/product.tregger");
const usersTregger = require("./treggers/users.tregger");

// // export const apiCommerce = functions.region("europe-west3").https.onRequest(userAppExpress);
// const productOpariton = require("./treggers/product-oparation.tregger");

// const OrderTrigger = require("./treggers/order.tregger");
// export const apiCommerceDashboard = functions
//   .region("europe-west3")
//   .https.onRequest(appExpress);

export const apiCommerce = functions
  .region("europe-west3")
  .https.onRequest(appExpress);
export const UsersTrigger = usersTregger.UsersTrigger;
// export const ProductOpartionTrigger = productOpariton.ProductOpartionTrigger;
// export const orderTregger = OrderTrigger.OrderTrigger;
