import { CollectionsName } from "../../constant/utils-consts/collection";
import { BaseRepository } from "../../data/db/repositories/base.repository";

export class CartRepo extends BaseRepository {
  async addToCart(userId: string, data: any) {
    return await this.getSubCollectionReference(
      CollectionsName.user,
      userId,
      CollectionsName.cart
    ).add(data);
  }
  async getCart(userId: string) {
    return await this.getSubCollectionReference(
      CollectionsName.user,
      userId,
      CollectionsName.cart
    ).get();
  }
  async deleteCart(userId: string, cartId: string) {
    return await this.getSubCollectionReference(
      CollectionsName.user,
      userId,
      CollectionsName.cart
    )
      .doc(cartId)
      .delete();
  }
  async updateCart(userId: string, cartId: string, data: any) {
    return await this.getSubCollectionReference(
      CollectionsName.user,
      userId,
      CollectionsName.cart
    )
      .doc(cartId)
      .update(data);
  }
  async getCartById(userId: string, cartId: string) {
    return await this.getSubCollectionReference(
      CollectionsName.user,
      userId,
      CollectionsName.cart
    )
      .doc(cartId)
      .get();
  }
}
