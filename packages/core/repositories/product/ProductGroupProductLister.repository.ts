import { eq, inArray } from "drizzle-orm";
import * as schema from "@core/models";
import { productGroupProduct, productGroup } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { ProductGroupProduct, ProductGroupProductList } from "@core/common/enums/models/product";

@injectable()
export class ProductGroupProductListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    groupId: number,
  ): Promise<ProductGroupProductList[]> {
    const result = await this.db
      .select({
        productId: productGroupProduct.id_produto,
      })
      .from(productGroupProduct)
      .where(eq(productGroupProduct.id_produto_grupo, groupId))
      .execute();

    return result;
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
