import { CollectionsName } from "../../../constant/utils-consts/collection";
import { BaseRepository } from "../../../data/db/repositories/base.repository";

export class ProductRepo extends BaseRepository {
  async getProducts(docId: string) {
    const depsDocs = await this.getSubCollectionReference(
      CollectionsName.category,
      docId,
      CollectionsName.product
    ).get();

    const depsData: Array<any> = [];
    depsDocs.forEach((e) => {
      const data = e.data();

      depsData.push(data);
    });
    return depsData;
  }

  // add crud operations
  async insetData(catId: string, data: any) {
    await this.getSubCollectionReference(
      CollectionsName.category,
      catId,
      CollectionsName.product
    ).add(data);
  }
  async updateData(catId: string, prodId: string, data: any) {
    await this.getSubCollectionReference(
      CollectionsName.category,
      catId,
      CollectionsName.product
    )
      .doc(prodId)
      .update(data);
  }
  async deleteData(catId: string, prodId: string) {
    await this.getSubCollectionReference(
      CollectionsName.category,
      catId,
      CollectionsName.product
    )
      .doc(prodId)
      .delete();
  }
}
