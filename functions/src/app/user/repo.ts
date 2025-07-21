import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../data/db/repositories/base.repository";

export class ProfileRepo extends BaseRepository {
  async setProfile(docId: string, results: any, prfile: any) {
    try {
      // set in subcollection
      const collection = this.getSubCollectionReference(
        CollectionsName.user,
        docId,
        CollectionsName.depGameResult
      );
      console.log(docId);
      const depId = results.depId;
      await collection.doc(depId).set(results);
      const collection2 = this.getCollectionReference(CollectionsName.user);
      await collection2.doc(docId).update(prfile);
    } catch (error) {
      console.log(error);
    }
  }

  async setMony(docId: string, mony: number) {
    try {
      // set in subcollection

      const collection2 = this.getCollectionReference(CollectionsName.user);
      await collection2.doc(docId).update({ mony });
    } catch (error) {
      console.log(error);
    }
  }

  //get userDocId
  async getDocData(authId: string) {
    const user = await this.getCollectionReference(CollectionsName.user)
      .where("uid", "==", authId)
      .get();

    return user.docs[0];
  }

  async getDoc(docId: string) {
    const data = await this.getCollectionReference(CollectionsName.user)
      .doc(docId)
      .get();
    return data;
  }
}
