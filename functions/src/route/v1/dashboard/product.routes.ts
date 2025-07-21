import { Application, NextFunction } from "express";
import { ProductController } from "../../../app/main-data/products/contraller";

export default function (app: Application) {
  app.get("/product/:catId", (req, res, next: NextFunction) => {
    return new ProductController().getProduct(req, res, next);
  });
  app.post("/product/:catId", (req, res, next: NextFunction) => {
    return new ProductController().createProduct(req, res);
  });
  // put and delete
  app.put("/product/:catId/:prodId", (req, res, next: NextFunction) => {
    return new ProductController().updateProduct(req, res);
  });
  app.delete("/product/:catId/:prodId", (req, res, next: NextFunction) => {
    return new ProductController().deleteProduct(req, res);
  });
}
