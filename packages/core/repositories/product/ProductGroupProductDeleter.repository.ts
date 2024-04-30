
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { productGroupProduct } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq } from "drizzle-orm";

@injectable()
export class ProductGroupProductDeleterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async delete(groupId: number, productId: string) {
    const result = await this.db
      .delete(productGroupProduct)
      .where(
        and(
          eq(productGroupProduct.id_produto_grupo, groupId),
          eq(productGroupProduct.id_produto, productId)
        )
      )
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
