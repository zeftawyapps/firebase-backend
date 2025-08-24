import { Application, NextFunction } from "express";
import { UserController } from "../../../app/user/contraller";

export default function (app: Application) {
  const userController = new UserController();

  // Create account
  app.post("/user/register", (req, res, next: NextFunction) => {
    return userController.createAccount(req, res, next);
  });

  // Login

  // Create profile
  //   app.post("/user/profile", (req, res, next: NextFunction) => {
  //     return userController.createProfile(req, res, next);
  //   });
}
