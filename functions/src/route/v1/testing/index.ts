import { Application } from "express";

export default function testingV1Routes(app: Application) {
  require("./driver-test.routes").default(app);
}
