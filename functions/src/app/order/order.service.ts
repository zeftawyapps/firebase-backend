import { OrderReposatory } from "./order.repo";
import { OperationProductRepo } from "../opration-data/prodect-opartion.repo";
import { OrderProductsReposatory } from "./orderProducts.repo";
import { ProductDataMovementRepo } from "../opration-data/product-data-movement.repo";

export class OrderService {
  private orderRepo: OrderReposatory;
  private products: OperationProductRepo;
  private prodcutsOrder: OrderProductsReposatory;
  private productMovment: ProductDataMovementRepo;

  constructor() {
    this.orderRepo = new OrderReposatory();
    this.products = new OperationProductRepo();
    this.prodcutsOrder = new OrderProductsReposatory();
    this.productMovment = new ProductDataMovementRepo();
  }

  async createOrder(data: any) {
    try {
      const products = data.products;
      // assure the product is in data
      if (!products || products.length === 0) {
        throw new Error("No products in order");
      }
      // find the product
      const dataProductFinded: any = [];
      const orderNumbers: number = Math.floor(Math.random() * 10000);
      const orderId: string = "s" + orderNumbers;

      await Promise.all(
        products.map(async (product: any) => {
          const productData = await this.findProduct(product.productData.id);
          if (!productData) {
            throw new Error(
              `Product with id ${product.productData.id} not found`
            );
          }

          dataProductFinded.push({
            productData: productData,
            quantity: product.quantity,
            price: product.price,
            name: product.name,
          });

          await this.prodcutsOrder.createOrderProduct(
            product,
            orderId,
            product.productData.id
          );
          const dataPosted = {
            productData: productData,
            orderId: orderId,
            quantity: product.quantity,
            price: product.price,
            name: product.name,
            total: product.total,
            client: data.client,
            date: data.orderDate,
          };
          await this.productMovment.insertProductMovement(orderId, dataPosted);
        })
      );
      // add order number

      const orderData = {
        client: data.client,
        orderNumber: orderId,
        orderDate: data.orderDate,
        status: data.status,
        netTotal: data.netTotal,
        taxRate: data.taxRate,
        products: dataProductFinded,
        tax: data.tax,
        total: data.total,
      };
      await this.orderRepo.createOrder(orderData, orderId);

      return "done";
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  private async findProduct(id: string) {
    return await this.products.findProductById(id);
  }
  async updateOrder(id: string, data: any) {
    return await this.orderRepo.updateOrder(id, data);
  }
  async deleteOrder(id: string) {
    return await this.orderRepo.deleteOrder(id);
  }
  async getOrders() {
    return await this.orderRepo.getOrders();
  }
  async getSingleOrder() {
    return await this.orderRepo.getSingleOrder();
  }
}
