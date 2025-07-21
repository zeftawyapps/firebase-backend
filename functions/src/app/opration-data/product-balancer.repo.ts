import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../data/db/repositories/base.repository";

export class ProductBalancerRepo extends BaseRepository {
  async insertprodecutBalancer(id: string, data: any) {
    return await this.insertById(CollectionsName.productBalancer, id, data);
  }

  // edit  the product
  async updateprodecutBalancer(id: string, data: any) {
    return await this.update(CollectionsName.productBalancer, id, data);
  }
  // find by id
  async findProduct(id: string) {
    const value = await this.getDocumentReference(
      CollectionsName.productBalancer,
      id
    ).get();

    const data = value.data();
    return data;
  }
}
