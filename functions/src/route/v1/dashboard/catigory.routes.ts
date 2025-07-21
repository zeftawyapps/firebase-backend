import { Application, NextFunction } from "express";
import { CategoryController } from "../../../app/main-data/category/contraller";

export default function (app: Application) {
  app.get("/category", (req, res, next: NextFunction) => {
    const cat = new CategoryController();
    return cat.getCategory(req, res, next);
  });
  app.post("/category", (req, res, next: NextFunction) => {
    const cat = new CategoryController();
    return cat.insertCatigory(req, res, next);
  });
  // put and delete
  app.put("/category/:id", (req, res, next: NextFunction) => {
    const cat = new CategoryController();
    return cat.updateCategory(req, res, next);
  });
  app.delete("/category/:id", (req, res, next: NextFunction) => {
    const cat = new CategoryController();
    return cat.deleteCategory(req, res, next);
  });
}
