import { Application, NextFunction } from "express";
 
export default function (app: Application) {
  app.get("/test", (req, res, next: NextFunction) => {
    res.send("user route");
  }
  );
}
