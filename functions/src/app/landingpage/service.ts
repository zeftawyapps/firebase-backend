import { CatRepo } from "../main-data/category/cat-repo";
import { ProductRepo } from "../main-data/products/product-repo";

export class LandingPageService {
  private catLoading: CatRepo;
  private productLoading: ProductRepo;
  constructor() {
    this.catLoading = new CatRepo();
    this.productLoading = new ProductRepo();
  }

  async laodingAllProducts() {
    const cat: any[] = await this.getcats();

    // asure if cat length >10 or not emplty
    if (cat.length > 10) {
      throw new Error(
        "can not load all products because cat length  greater than 10"
      );
    } else if (!cat || cat.length === 0) {
      throw new Error("cat is empty");
    }

    await Promise.all(
      cat.map(async (c) => {
        c["products"] = [];
        c.products = await this.getProducts(c.docId);
      })
    );
    const productData = cat;
    const response = { productData, viewMode: "all-categs-all-imageProds" };
    return response;
  }

  async getcats() {
    return this.catLoading.getcats();
  }

  async getProducts(docId: string) {
    return this.productLoading.getProducts(docId);
  }
}
