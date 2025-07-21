import { Application, NextFunction } from "express";
import { TestContraller } from "../../../appTester/app-contraller";
 
export default function (app: Application) {
  app.get("/testConnection", (req, res, next: NextFunction) => {
 
      new TestContraller().test(req, res , next ); 
      
  }
  );
}