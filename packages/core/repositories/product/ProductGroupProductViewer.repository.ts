
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { productGroupProduct } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq } from "drizzle-orm";

@injectable()
export class ProductGroupProductViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(groupId: number, productId: string) {
    const results = await this.db
      .select({
        groupId: productGroupProduct.id_produto_grupo,
        productId: productGroupProduct.id_produto,
      })
      .from(productGroupProduct)
      .where(
        and(
          eq(productGroupProduct.id_produto_grupo, groupId),
          eq(productGroupProduct.id_produto, productId)
        )
      )
      .execute();

    if (!results.length) {
      return false;
    }

    return results[0];
  }
}
