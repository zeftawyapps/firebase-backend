import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../util/base.repository";

export class OrderReposatory extends BaseRepository {
  // update

  async createOrder(data: any, orderNumber: string) {
    await this.getCollectionReference(CollectionsName.order)
      .doc(orderNumber)
      .set(data);
  }
  async updateOrder(id: string, data: any) {
    return await this.update(CollectionsName.order, id, data);
  }

  // delete
  async deleteOrder(id: string) {
    return await this.delete(CollectionsName.order, id);
  }
  // get order
  async getOrders() {
    const doc = await this.getCollectionReference(CollectionsName.order).get();

    const docs = doc.docs;
    const data = docs.map((doc) => doc.data());
    return data;
  }
  // get one order
  async getSingleOrder() {
    return await this.getCollectionReference(CollectionsName.order).get();
  }
}
