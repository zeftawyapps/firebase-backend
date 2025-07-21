import { CartService } from "./cart.service";
import { NextFunction } from "express";

import { AppUtil } from "../../util/app.util";
import { cartValidation } from "./validation";

export class cartController {
  private cartService: CartService;
  constructor() {
    this.cartService = new CartService();
  }
  // add cart the contrall called from route
  async addTocart(req: any, res: any, next: NextFunction) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, cartValidation.cart);
      const user: string = data.userId;

      const result = await this.cartService.addCartItem(user, data);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  // update cart the contrall called from route
  async updateCart(req: any, res: any, next: NextFunction) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, cartValidation.cart);
      const user: string = data.userId;
      const productId: string = data.productId;

      const result = await this.cartService.updateCartItem(
        user,
        productId,
        data
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  // delete cart the contrall called from route
  async deleteCart(req: any, res: any, next: NextFunction) {
    try {
      const body = req.body;
      const data = AppUtil.validate(body, cartValidation.cart);
      const user: string = data.userId;
      const productId: string = data.productId;

      const result = await this.cartService.removeCartItem(user, productId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  // get cart the contrall called from route
  async getCart(req: any, res: any, next: NextFunction) {
    try {
      const user: string = req.params.userId;
      const result = await this.cartService.getCartItems(user);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  // get cart the contrall called from route
}
