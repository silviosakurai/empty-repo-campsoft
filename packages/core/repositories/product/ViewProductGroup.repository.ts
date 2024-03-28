import { eq } from "drizzle-orm";
import * as schema from "@core/models";
import { productGroup } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { ProductGroup } from "@core/common/enums/models/product";

@injectable()
export class ViewProductGroupRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async get(id_product_group: number): Promise<ProductGroup | null> {
    const result = await this.db
      .select({
        product_group_id: productGroup.id_produto_grupo,
        name: productGroup.produto_grupo,
        quantity: productGroup.qtd_produtos_selecionaveis,
      })
      .from(productGroup)
      .where(eq(productGroup.id_produto_grupo, id_product_group))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0];
  }
}
