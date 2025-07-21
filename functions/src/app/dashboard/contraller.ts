import { NextFunction } from "express";
import { DashboardService } from "./service";
import { ResponseUtil } from "../../util/response.util";

export class DashboardController {
  private dashboardService: DashboardService;
  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getDashboard(req: any, res: any, next: NextFunction) {
    try {
      const data = await this.dashboardService.LoadProductStatistec();

      ResponseUtil.sendResponse(req, res, data);
    } catch (error) {
      ResponseUtil.sendException(req, res, error);
    }
  }
}
