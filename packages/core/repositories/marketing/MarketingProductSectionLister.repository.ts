import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { marketingProductSection } from "@core/models";
import { eq, and } from "drizzle-orm";
import { MarketingProductSectionsList } from "@core/interfaces/repositories/marketing";

@injectable()
export class MarketingProductSectionListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(productId: string): Promise<MarketingProductSectionsList[]> {
    const select = await this.db
      .select({
        title: marketingProductSection.titulo,
        image_background: marketingProductSection.url_imagem,
      })
      .from(marketingProductSection)
      .where(and(eq(marketingProductSection.id_produto, productId)))
      .execute();

    if (!select?.length) {
      return [] as MarketingProductSectionsList[];
    }

    return select as MarketingProductSectionsList[];
  }
}
