import { CollectionsName } from "../../../constant/utils-consts/collection";
import { BaseRepository } from "../../../util/base.repository";

export class DepRepo extends BaseRepository {
  async getDepsSorts() {
    const depsDocs = await this.getCollectionGroup(
      CollectionsName.department
    ).get();

    const depsData: Array<number> = [];
    depsDocs.forEach((e) => {
      const data = e.data();
      if (data.sort) {
        depsData.push(data.sort);
      }
    });
    return depsData;
  }
  async getDeps() {
    const depsDocs = await this.getCollectionGroup(
      CollectionsName.department
    ).get();

    return depsDocs;
  }

  async getDepsQuistions(docId: string) {
    const depsDocs = await this.getSubCollectionReference(
      CollectionsName.department,
      docId,
      CollectionsName.quiz
    ).get();

    const depsData: Array<any> = [];
    depsDocs.forEach((e) => {
      const data = e.data();

      depsData.push(data);
    });
    return depsData;
  }

  async getDepsData(docId: string) {
    const depsDoc = await this.getDocumentReference(
      CollectionsName.department,
      docId
    ).get();

    return depsDoc.data();
  }
}
