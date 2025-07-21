import { CartRepo } from "./cart.rep";

export class CartService {
  private cartRep: CartRepo;
  constructor() {
    this.cartRep = new CartRepo();
  }
  async getCartItems(userId: string) {
    return await this.cartRep.getCart(userId);
  }
  //
  async addCartItem(userId: string, data: any) {
    return await this.cartRep.addToCart(userId, data);
  }

  async removeCartItem(userId: string, productId: string) {
    return await this.cartRep.delete(userId, productId);
  }
  async updateCartItem(userId: string, productId: string, data: any) {
    return await this.cartRep.update(userId, productId, data);
  }
}
