import { Application, NextFunction } from "express";
import { OrderController } from "../../../app/order/order.contraller";
import { userAuthMiddleware } from "../../../app/middleware/user-auth.middleware";

export default function (app: Application) {
  app.post("/order", userAuthMiddleware, (req, res, next: NextFunction) => {
    const cat = new OrderController();
    return cat.createOrder(req, res, next);
  });
  // update order
  app.put("/order", (req, res, next: NextFunction) => {
    const cat = new OrderController();
    return cat.updateOrder(req, res, next);
  });
  // delete order
  app.delete("/order", (req, res, next: NextFunction) => {
    const cat = new OrderController();
    return cat.deleteOrder(req, res, next);
  });
  // get orders
  app.get("/order", (req, res, next: NextFunction) => {
    const cat = new OrderController();
    return cat.getOrders(req, res, next);
  });
  // get one order
  app.get("/order/:id", (req, res, next: NextFunction) => {
    const cat = new OrderController();
    return cat.getSingleOrder(req, res, next);
  });
}
