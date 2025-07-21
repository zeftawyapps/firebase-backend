import { NextFunction } from "express";
import { AuthUtil } from "../../util/auth.util";

export async function userAuthMiddleware(
  req: any,
  res: any,
  next: NextFunction
) {
  try {
    req.user = await AuthUtil.getUserFromReq(req);
    next();
  } catch (e) {
    next(e);
  }
}
