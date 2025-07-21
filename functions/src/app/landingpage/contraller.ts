import { NextFunction } from "express";
import { LandingPageService } from "./service";
import { ResponseUtil } from "../../util/response.util";

export class LandingPageController {
  private landingPageService: LandingPageService;
  constructor() {
    this.landingPageService = new LandingPageService();
  }

  async getLandingPage(req: any, res: any, next: NextFunction) {
    try {
      const data = await this.landingPageService.laodingAllProducts();

      ResponseUtil.sendResponse(req, res, data);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }
}
