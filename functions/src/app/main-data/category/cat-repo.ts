import { CollectionsName } from "../../../constant/utils-consts/collection";
import { BaseRepository } from "../../../data/db/repositories/base.repository";

export class CatRepo extends BaseRepository {
  async getcatsSorts() {
    const catsDocs = await this.getCollectionGroup(
      CollectionsName.category
    ).get();

    const catsData: Array<number> = [];
    catsDocs.forEach((e) => {
      const data = e.data();
      if (data.sort) {
        catsData.push(data.sort);
      }
    });
    return catsData;
  }
  async getcats() {
    const catsDocs = await this.getCollectionGroup(
      CollectionsName.category
    ).get();

    return catsDocs.docs.map((e) => {
      // add data and id
      const docId = e.id;
      const data = e.data();
      return { docId, ...data };
    });
  }

  async getcatsQuistions(docId: string) {
    const catsDocs = await this.getSubCollectionReference(
      CollectionsName.category,
      docId,
      CollectionsName.product
    ).get();

    const catsData: Array<any> = [];
    catsDocs.forEach((e) => {
      const data = e.data();

      catsData.push(data);
    });
    return catsData;
  }

  async getcatsData(docId: string) {
    const catsDoc = await this.getDocumentReference(
      CollectionsName.category,
      docId
    ).get();

    return catsDoc.data();
  }

  // insert method
  async insertData(data: any) {
    return await this.getCollectionReference(CollectionsName.category).add(
      data
    );
  }

  // update method
  async updateData(docId: string, data: any) {
    return await this.getDocumentReference(
      CollectionsName.category,
      docId
    ).update(data);
  }
  // delete method
  async deleteData(docId: string) {
    return await this.getDocumentReference(
      CollectionsName.category,
      docId
    ).delete();
  }
}
