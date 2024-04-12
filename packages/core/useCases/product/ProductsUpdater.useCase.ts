import { injectable } from "tsyringe";
import { UpdateProductRequest } from "./dtos/UpdateProductRequest.dto";

@injectable()
export class ProductsUpdaterUseCase {
  constructor() {}

  async update(productId: string, input: UpdateProductRequest) {}
}
