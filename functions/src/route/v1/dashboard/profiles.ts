import { Application, NextFunction } from "express";
import { UserController } from "../../../app/user/contraller";
import { userAuthMiddleware } from "../../../app/middleware/user-auth.middleware";

export default function (app: Application) {
  app.post(
    "/setDepGameResult",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      new UserController().setProfileDepGameResult(req, res, next);
    }
  );

  app.post(
    "/setPrfileMony",
    userAuthMiddleware,
    (req, res, next: NextFunction) => {
      new UserController().setProfileMony(req, res, next);
    }
  );

  // app.get("/getProfileDepsResult", (req, res, next: NextFunction) => {
  //   new UserController().setProfileDepGameResult(req, res, next);
  // });
}
