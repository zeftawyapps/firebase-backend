import * as functions from "firebase-functions";
import { auth, firestore } from "firebase-admin";
 
import Auth = auth.Auth;
import Firestore = firestore.Firestore;
import { FirebaseApp } from "../app/init";

class FirebaseDatasource {
  public database() {
    return FirebaseApp.database;
  }
  public auth(): Auth {
    return FirebaseApp.auth();
  }

  public firestore(): Firestore {
    return FirebaseApp.firestore();
  }

  public functions() {
    return functions;
  }
}

const firebase = new FirebaseDatasource();
export { firebase };
