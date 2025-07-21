import { Application } from "express";

export default function dashboardV1Routes(app: Application) {
  require("./user.routes").default(app);
  require("./test").default(app);
  require("./dep").default(app);
  require("./quiz").default(app);
  require("./profiles").default(app);
  require("./catigory.routes").default(app);
  require("./product.routes").default(app);
  require("./order.routes").default(app);
}
