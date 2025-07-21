import { Application, NextFunction } from "express";
import { cartController } from "../../../app/cart/cart.conraller";

export default function (app: Application) {
  app.post("/cart", (req, res, next: NextFunction) => {
    const cat = new cartController();
    return cat.addTocart(req, res, next);
  });
  // update order
  app.put("/cart", (req, res, next: NextFunction) => {
    const cat = new cartController();
    return cat.updateCart(req, res, next);
  });
  // delete order
  app.delete("/cart", (req, res, next: NextFunction) => {
    const cat = new cartController();
    return cat.deleteCart(req, res, next);
  });
  // get orders
  // app.get("/cart", (req, res, next: NextFunction) => {
  //   const cat = new cartController();
  //   return cat.get(req, res, next);
  // });
  // // get one order
  // app.get("/cart/:id", (req, res, next: NextFunction) => {
  //   const cat = new cartController();
  //   return cat.getCartItems(req, res, next);
  // });
}
