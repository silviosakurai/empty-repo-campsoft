import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { product, productPartner, productType } from "@core/models";
import { eq, and, inArray } from "drizzle-orm";
import { ProductViewerCart } from "@core/interfaces/repositories/cart";

@injectable()
export class ProductListerByCartRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async listByIds(productIds: string[]): Promise<ProductViewerCart[]> {
    const products = await this.db
      .select({
        product_id: product.id_produto,
        name: product.produto,
        short_description: product.descricao_curta,
        images: {
          main_image: product.imagem,
          icon: product.icon,
          logo: product.logo,
          background_image: product.imagem_background,
        },
      })
      .from(product)
      .innerJoin(
        productPartner,
        eq(product.id_produto, productPartner.id_produto)
      )
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(and(inArray(product.id_produto, productIds)))
      .groupBy(product.id_produto)
      .execute();

    return products as ProductViewerCart[];
  }
}
