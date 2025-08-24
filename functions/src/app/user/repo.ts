import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../util/base.repository";
import { User } from "./model";

export class ProfileRepo extends BaseRepository {
  // Create user account
  async createAccount(userData: any): Promise<string> {
    try {
      const collection = this.getCollectionReference(CollectionsName.users);
      const docRef = collection.doc(userData.uid);

      const user = new User({
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        isFirstTimeLogin: true,
      });

      await docRef.set(user.toJson());
      return docRef.id;
    } catch (error) {
      console.log("Error creating user account:", error);
      throw error;
    }
  }

  // Login - get user by email
  async getUserByEmail(email: string) {
    try {
      const users = await this.getCollectionReference(CollectionsName.users)
        .where("email", "==", email)
        .get();

      if (users.empty) {
        throw new Error("User not found");
      }

      return users.docs[0];
    } catch (error) {
      console.log("Error getting user by email:", error);
      throw error;
    }
  }

  // Update user login status
  // async updateLoginStatus(uid: string, isFirstTimeLogin: boolean = false) {
  //   try {
  //     const collection = this.getCollectionReference(CollectionsName.users);
  //     await collection.doc(uid).update({
  //       isFirstTimeLogin: isFirstTimeLogin,
  //       updatedAt: new Date().toISOString(),
  //     });
  //   } catch (error) {
  //     console.log("Error updating login status:", error);
  //     throw error;
  //   }
  // }
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
