import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { product } from "@core/models";
import { eq } from "drizzle-orm";
import { ProductImageRepositoryCreateInput } from "@core/interfaces/repositories/products";

@injectable()
export class ProductImagesUrlUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(productId: string, input: ProductImageRepositoryCreateInput) {
    const result = await this.db
      .update(product)
      .set({
        imagem: input.imageUrl,
        icon: input.iconUrl,
        logo: input.logoUrl,
      })
      .where(eq(product.id_produto, productId));

    if (!result[0].affectedRows) return false;

    return true;
  }
}
