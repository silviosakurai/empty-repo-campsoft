import { injectable } from "tsyringe";
import { ProductService } from "@core/services";
import { CreateProductRequest } from "./dtos/CreateProductRequest.dto";

@injectable()
export class ProductsCreatorUseCase {
  constructor(
    private readonly productService: ProductService,
  ) {}

  async execute(
    body: CreateProductRequest,
  ): Promise<boolean> {
    return this.productService.create(body);
  }
}
