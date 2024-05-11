import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { AddProductToPartnerBodyRequest } from "./dtos/AddProductToPartnerRequest.dto";

@injectable()
export class ProductsToPartnerAdderUseCase {
  constructor(
    private readonly productService: ProductService,
  ) {}

  async execute(
    partnerId: number,
    body: AddProductToPartnerBodyRequest,
  ): Promise<boolean | null> {
    const productPartnerPromises = 
      body.products.map(productId => this.productService.createProductPartner(productId, partnerId));

    try {
      await Promise.all(productPartnerPromises);
      return true;
    } catch (error) {
      return false;
    }
  }
}
