import { eq, inArray } from "drizzle-orm";
import * as schema from "@core/models";
import { productGroupProduct, productGroup } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { ProductGroupProduct } from "@core/common/enums/models/product";

@injectable()
export class ListProductGroupProductRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async listByProductsIds(
    productIds: string[]
  ): Promise<ProductGroupProduct[]> {
    const result = await this.db
      .select({
        product_id: productGroupProduct.id_produto,
        product_group_id: productGroupProduct.id_produto_grupo,
        name: productGroup.produto_grupo,
        quantity: productGroup.qtd_produtos_selecionaveis,
      })
      .from(productGroupProduct)
      .innerJoin(
        productGroup,
        eq(productGroupProduct.id_produto_grupo, productGroup.id_produto_grupo)
      )
      .where(inArray(productGroupProduct.id_produto, productIds))
      .execute();

    return result;
  }
}
