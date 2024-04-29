
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { productGroupProduct } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";

@injectable()
export class ProductGroupProductCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(groupId: number, productId: string) {
    const result = await this.db
      .insert(productGroupProduct)
      .values({
        id_produto_grupo: groupId,
        id_produto: productId,
      })
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
