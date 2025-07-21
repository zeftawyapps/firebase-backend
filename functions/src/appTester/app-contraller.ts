import { NextFunction } from "express";
 import { TestContrallerFirebase } from "../data/db/repositories/text-connection.rebo";
import { ResponseUtil } from "../util/response.util";

export class TestContraller {

    async test(req: any, res: any , next: NextFunction) {
   const firebase = new TestContrallerFirebase(); 
await   firebase.insert("testBackEnd", {test: true}); 
ResponseUtil.sendResponse(
    req,
    res,
    "mistakes added successfully"
  );
}

}