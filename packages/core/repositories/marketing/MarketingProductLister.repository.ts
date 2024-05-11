import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { marketingProduct } from "@core/models";
import { eq, and } from "drizzle-orm";
import { MarketingProductList } from "@core/interfaces/repositories/marketing";

@injectable()
export class MarketingProductListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(productId: string): Promise<MarketingProductList[]> {
    const select = await this.db
      .select({
        marketing_produto_id: marketingProduct.marketing_produto_id,
        marketing_produto_tipo_id: marketingProduct.marketing_produto_tipo_id,
        id_produto: marketingProduct.id_produto,
        titulo: marketingProduct.titulo,
        sub_titulo: marketingProduct.sub_titulo,
        descricao: marketingProduct.descricao,
        url_imagem: marketingProduct.url_imagem,
        url_video: marketingProduct.url_video,
      })
      .from(marketingProduct)
      .where(and(eq(marketingProduct.id_produto, productId)))
      .execute();

    if (!select?.length) {
      return [] as MarketingProductList[];
    }

    return select as MarketingProductList[];
  }
}
