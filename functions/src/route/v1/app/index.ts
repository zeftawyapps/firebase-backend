import { Application } from "express";

export default function appV1Routes(app: Application) {
  require("./landing.routes").default(app);
}
