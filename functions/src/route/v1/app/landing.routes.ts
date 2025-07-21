import { Application, NextFunction } from "express";
import { LandingPageController } from "../../../app/landingpage/contraller";
import { DashboardController } from "../../../app/dashboard/contraller";

export default function (app: Application) {
  app.get("/landingPage", (req, res, next: NextFunction) => {
    const cat = new LandingPageController();
    return cat.getLandingPage(req, res, next);
  });

  app.get("/dashboard", (req, res, next: NextFunction) => {
    const cat = new DashboardController();
    return cat.getDashboard(req, res, next);
  });
}
