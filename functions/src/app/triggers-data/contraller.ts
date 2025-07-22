import { CollectionsName } from "../../constant/utils-consts/collection";
import { orderStatus } from "../../constant/utils-consts/order-constant";
import { OperationsProductService } from "./service";

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
    console.log("onUsersRulesChangedTrigger oldUserData", oldUserData, userId);

    const data = snapshot.after.data();
    console.log("onUsersRulesChangedTrigger", data, userId);

    // if (data.status == orderStatus.refunded) {
    //   const productService = new OperationsProductService();
    //   const orderData = data;
    //   productService.addProductMovement(orderData, orderId);
    // }

    return await this;
  }
}
