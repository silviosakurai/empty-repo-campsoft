import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { marketingProductHighlights } from "@core/models";
import { eq, and } from "drizzle-orm";
import { MarketingProductHighlightsList } from "@core/interfaces/repositories/marketing";

@injectable()
export class MarketingProductHighlightsListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(productId: string): Promise<MarketingProductHighlightsList[]> {
    const select = await this.db
      .select({
        title: marketingProductHighlights.titulo,
        subtitle: marketingProductHighlights.sub_titulo,
        description: marketingProductHighlights.descricao,
        image_background: marketingProductHighlights.url_imagem,
      })
      .from(marketingProductHighlights)
      .where(and(eq(marketingProductHighlights.id_produto, productId)))
      .execute();

    if (!select?.length) {
      return [] as MarketingProductHighlightsList[];
    }

    return select as MarketingProductHighlightsList[];
  }
}
