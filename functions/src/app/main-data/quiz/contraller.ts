import { NextFunction } from "express";
import { Request as ExpressRequest } from "express";
import { QuizService } from "./service";
import { ResponseUtil } from "../../../util/response.util";
import { Response as ExpressResponse } from "express";

export class QuizController {
  srevice: QuizService;
  constructor() {
    this.srevice = new QuizService();
  }

  async getQuiz(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    try {
      const docId = req.query.depId;
      // add validation

      const quiez = await this.srevice.getQuestions(docId);
      ResponseUtil.sendResponse(req, res, quiez);
    } catch (e) {
      ResponseUtil.sendException(req, res, e);
      next(e);
    }
  }
}
