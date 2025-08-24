import { Application } from "express";

export default function appV1Routes(app: Application) {
  require("./landing.routes").default(app);
  require("./driver.routes").default(app);
  require("./shop.routes").default(app);
  require("./location-point.routes").default(app);
  require("./cart.routes").default(app);
  require("./user.routes").default(app);
}
