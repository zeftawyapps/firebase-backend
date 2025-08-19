import { UnauthorizedException } from "../exception/unauthorized.exception";
import { Request } from "express";

export class AuthUtil {
  static async getUserFromReq(req: Request) {
    const token = req.header("authorization") ?? "";
    console.log("AuthUtil.getUserFromReq: token", token);
    
    return await AuthUtil.getUserFromToken(token!);
  }

  static async getUserFromToken(token: string): Promise<{
    userId: string;
    email?: string;
    iat: number;
    exp: number;
    name: string;
  }> {
    try {
      const decoded = await AuthUtil.parseJwt(token);
      return {
        exp: decoded.exp,
        iat: decoded.iat,
        userId: decoded.user_id,
        email: decoded.email,
        name: decoded.name,
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException("errors.unAuthorized");
    }
  }

  private static parseJwt(token: string) {
    const decodedJwt = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    if (!decodedJwt) {
      throw new UnauthorizedException("errors.unAuthorized");
    }
    return decodedJwt;
  }
}
