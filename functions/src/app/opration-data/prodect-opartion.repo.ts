import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../data/db/repositories/base.repository";

export class OperationProductRepo extends BaseRepository {
  // create  method to add productData
  async createProductData(id: string, data: any) {
    return await this.insertById(CollectionsName.productCollects, id, data);
  }

  async loadProductData() {
    const doc = await this.getCollectionReference(
      CollectionsName.productBalancer
    ).get();
    const data: any[] = [];
    const docs = doc.docs;
    docs.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  }

  // find by id
  async findProductById(id: string) {
    const value = await this.getDocumentReference(
      CollectionsName.productCollects,
      id
    ).get();
    return value.data();
  }
}
