import { Application, NextFunction } from "express";
import { QuizController } from "../../../app/main-data/quiz/contraller";

export default function (app: Application) {
  app.get("/getQuiz", (req, res, next: NextFunction) => {
    new QuizController().getQuiz(req, res, next);
  });
}
