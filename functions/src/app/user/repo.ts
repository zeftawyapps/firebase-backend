import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../util/base.repository";

export class ProfileRepo extends BaseRepository {
  async setProfile(docId: string, results: any, prfile: any) {
    try {
      // set in subcollection
      const collection = this.getSubCollectionReference(
        CollectionsName.users,
        docId,
        CollectionsName.depGameResult
      );
      console.log(docId);
      const depId = results.depId;
      await collection.doc(depId).set(results);
      const collection2 = this.getCollectionReference(CollectionsName.users);
      await collection2.doc(docId).update(prfile);
    } catch (error) {
      console.log(error);
    }
  }

  async setMony(docId: string, mony: number) {
    try {
      // set in subcollection

      const collection2 = this.getCollectionReference(CollectionsName.users);
      await collection2.doc(docId).update({ mony });
    } catch (error) {
      console.log(error);
    }
  }

  //get userDocId
  async getDocData(authId: string) {
    const user = await this.getCollectionReference(CollectionsName.users)
      .where("uid", "==", authId)
      .get();

    return user.docs[0];
  }

  async getDoc(docId: string) {
    const data = await this.getCollectionReference(CollectionsName.users)
      .doc(docId)
      .get();
    return data;
  }
}
