import { Application, NextFunction } from "express";
import { LandingPageController } from "../../../app/landingpage/contraller";
import { DashboardController } from "../../../app/dashboard/contraller";
import { userAuthMiddleware } from "../../../app/middleware/user-auth.middleware";

export default function (app: Application) {
  app.get("/landingPage", userAuthMiddleware, (req, res, next: NextFunction) => {
    const cat = new LandingPageController();
    return cat.getLandingPage(req, res, next);
  });

  app.get("/dashboard", userAuthMiddleware, (req, res, next: NextFunction) => {
    const cat = new DashboardController();
    return cat.getDashboard(req, res, next);
  });
}