import { CollectionsName } from "../../../constant/utils-consts/collection";
import { BaseRepository } from "../../../data/db/repositories/base.repository";

export class QuizRepo extends BaseRepository {
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
}
