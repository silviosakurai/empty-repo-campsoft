import { eq } from "drizzle-orm";
import * as schema from "@core/models";
import { productGroupProduct, productGroup } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import {
  ListProductGroupResponse,
  ListProductGroupPreviewResponse,
} from "@core/useCases/product/dtos/ListProductGroupResponse.dto";

@injectable()
export class ProductGroupListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(): Promise<ListProductGroupResponse[]> {
    const result = await this.db
      .select({
        product_group_id: productGroup.id_produto_grupo,
        name: productGroup.produto_grupo,
        choices: productGroup.qtd_produtos_selecionaveis,
      })
      .from(productGroup)
      .execute();
    const enrichedPromises = await this.enrichProductGroupsPromises(result);

    return enrichedPromises;
  }

  private async enrichProductGroupsPromises(
    result: ListProductGroupPreviewResponse[]
  ) {
    const enrichProductGroupsPromises = result.map(
      async (productsGroups: ListProductGroupPreviewResponse) => ({
        ...productsGroups,
        products: await this.fetchProducts(
          Number(productsGroups.product_group_id)
        ),
      })
    );
    const enrichedProductGroupsPromises = await Promise.all(
      enrichProductGroupsPromises
    );

    return enrichedProductGroupsPromises;
  }

  private async fetchProducts(product_group_id: number): Promise<string[]> {
    const products = await this.db
      .select({
        products: productGroupProduct.id_produto,
      })
      .from(productGroupProduct)
      .where(eq(productGroupProduct.id_produto_grupo, product_group_id))
      .execute();
    if (products.length === 0) {
      return [];
    }
    const productIds = products.map((product) => product.products.toString());

    return productIds;
  }
}
