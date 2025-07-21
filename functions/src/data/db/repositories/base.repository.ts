import { firebase } from "../../firebase-datasource";
import { firestore } from "firebase-admin";
import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;
import { AppUtil } from "../../../util/app.util";

export abstract class BaseRepository {
  private db = firebase.firestore();

  public getDocumentReference(collection: string, documentId: string) {
    return this.db.collection(collection).doc(documentId);
  }
  public update(collectionName: string, docId: string, data: any) {
    this.getDocumentReference(collectionName, docId).update(data);
  }
  public delete(collectionName: string, docId: string) {
    this.getDocumentReference(collectionName, docId).delete();
  }
  public getCollectionReference(
    collection: string
  ): CollectionReference<DocumentData> {
    return this.db.collection(collection);
  }

  public getSubDocumentReference(
    collection: string,
    documentId: string,
    subCollection: string,
    subDocumentId: string
  ) {
    return this.db
      .collection(collection)
      .doc(documentId)
      .collection(subCollection)
      .doc(subDocumentId);
  }

  public getSubCollectionReference(
    collection: string,
    documentId: string,
    subCollection: string
  ) {
    return this.db
      .collection(collection)
      .doc(documentId)
      .collection(subCollection);
  }

  public async insert(collectionName: string, data: any) {
    await this.getCollectionReference(collectionName).add(data);
  }
  public async insertById(collectionName: string, id: string, data: any) {
    await this.getCollectionReference(collectionName).doc(id).set(data);
  }
  public createDoc(collectionName: string) {
    return this.getDocumentReference(collectionName, AppUtil.generateID());
  }

  public getCollectionGroup(collectionName: string) {
    return this.db.collectionGroup(collectionName);
  }

  protected createBatch() {
    return this.db.batch();
  }
}
