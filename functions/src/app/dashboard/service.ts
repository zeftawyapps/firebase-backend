import { OperationProductRepo } from "../opration-data/prodect-opartion.repo";
import { ProductDataMovementRepo } from "../opration-data/product-data-movement.repo";

export class DashboardService {
  private productMovment: ProductDataMovementRepo;
  private productCollection: OperationProductRepo;
  constructor() {
    this.productMovment = new ProductDataMovementRepo();
    this.productCollection = new OperationProductRepo();
  }

  async LoadProductStatistec() {
    const product = await this.productCollection.loadProductData();
    product;
    const movment = await this.productMovment.loadMovment();
    return movment;
  }
}
