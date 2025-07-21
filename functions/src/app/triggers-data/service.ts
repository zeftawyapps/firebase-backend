import { OperationProductRepo } from "../opration-data/prodect-opartion.repo";
import { ProductBalancerRepo } from "../opration-data/product-balancer.repo";
import { ProductDataMovementRepo } from "../opration-data/product-data-movement.repo";

export class OperationsProductService {
  private productRepo: OperationProductRepo;
  private productBalancerRepo: ProductBalancerRepo;
  private productMovment: ProductDataMovementRepo;
  constructor() {
    this.productRepo = new OperationProductRepo();
    this.productBalancerRepo = new ProductBalancerRepo();
    this.productMovment = new ProductDataMovementRepo();
  }

  // create  method to add productData
  async createProductData(id: string, data: any) {
    return await this.productRepo.createProductData(id, data);
  }

  async createProductBalancerData(id: string, data: any) {
    return await this.productBalancerRepo.insertprodecutBalancer(id, data);
  }

  async addProductMovement(data: any, orderId: string) {
    const products: any[] = [];
    if (products.length > 0) {
      products.forEach(async (product: any) => {
        const productId = product.productId;
        const quantity = product.quantity;
        const orderDate = data.orderDate;
        const orderNumber = orderId;
        const price = product.price;

        const total = quantity * price;
        const name = product.name;
        const balanceData = {
          productId,

          quantity,
          orderDate,
          orderNumber,
          name,
          balanced: false,
          price,
          total,
        };
        this.productMovment.insertProductMovement(orderNumber, balanceData);
      });
    }
  }
}
