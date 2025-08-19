import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../util/base.repository";

export class OrderProductsReposatory extends BaseRepository {
  // update

  async createOrderProduct(data: any, orderNumber: string, productid: string) {
    const doc = await this.getSubCollectionReference(
      CollectionsName.order,
      orderNumber,
      CollectionsName.orderProducts
    );
    return await doc.add(data);
  }
  async updateOrder(id: string, data: any) {
    return await this.update(CollectionsName.orderProducts, id, data);
  }

  // delete
  async deleteOrder(id: string) {
    return await this.delete(CollectionsName.orderProducts, id);
  }
  // get order
  async getOrderProducts(orderNumber: string) {
    const doc = this.getCollectionReference(CollectionsName.order);

    return doc;
  }
  // get one order
  async getSingleOrder() {
    return await this.getCollectionReference(
      CollectionsName.orderProducts
    ).get();
  }
}
