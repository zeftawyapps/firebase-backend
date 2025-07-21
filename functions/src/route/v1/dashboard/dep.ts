import { Application, NextFunction } from "express";
import { DepController } from "../../../app/main-data/dep/contraller";

export default function (app: Application) {
  app.post("/changeSorting", (req, res, next: NextFunction) => {
    new DepController().changeSorting(req, res, next);
  });

  app.post("/createDoc", (req, res, next: NextFunction) => {
    new DepController().createDep(req, res, next);
  });

  app.post("/publishDep", (req, res, next: NextFunction) => {
    new DepController().publishDep(req, res, next);
  });

  app.post("/setMony", (req, res, next: NextFunction) => {
    new DepController().setMony(req, res, next);
  });

  app.post("/resortDeps", (req, res, next: NextFunction) => {
    new DepController().resortDeps(req, res, next);
  });
}
