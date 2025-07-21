import { ProductRepo as ProductsRepo } from "./product-repo";

export class ProductsService {
  prodRepo: ProductsRepo;
  constructor() {
    this.prodRepo = new ProductsRepo();
  }
  async getProduct(catId: any) {
    const quws = await this.prodRepo.getProducts(catId);
    return quws;
  }

  async setProductTrigger(catId: any) {
    const quws = await this.prodRepo.getProducts(catId);
    return quws;
  }

  // add crud operations
  async createProduct(catId: string, data: any) {
    const quws = await this.prodRepo.insetData(catId, data);
    return quws;
  }
  async updateProduct(catId: any, prodId: any, data: any) {
    await this.prodRepo.updateData(catId, prodId, data);
  }
  async deleteProduct(catId: any, prodId: any) {
    await this.prodRepo.deleteData(catId, prodId);
  }
}
