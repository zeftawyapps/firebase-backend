import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../data/db/repositories/base.repository";

export class ProductDataMovementRepo extends BaseRepository {
  async insertProductMovement(id: string, data: any) {
    return await this.insert(CollectionsName.productMovement, data);
  }

  async findProduct(id: string) {
    // get product where id
    const value = await this.getCollectionReference(
      CollectionsName.productCollects
    )
      .where("productId", "==", id)
      .get();
    const data = value.docs.map((doc) => doc.data());
    return data;
  }
  async loadMovment() {
    const value = await this.getCollectionReference(
      CollectionsName.productMovement
    )
    .get();
    const data = value.docs.map((doc) => doc.data());
    return data;
  }
  async getUnbalanced() {
    // get product where id
    const value = await this.getCollectionReference(
      CollectionsName.productCollects
    )
      .where("balance", "==", false)
      .get();
    const data = value.docs.map((doc) => doc.data());
    return data;
  }
}
