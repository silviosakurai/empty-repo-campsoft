import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { marketingProductMagazines } from "@core/models";
import { eq, and } from "drizzle-orm";
import { MarketingProductMagazinesList } from "@core/interfaces/repositories/marketing";

@injectable()
export class MarketingProductMagazinesListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(productId: string): Promise<MarketingProductMagazinesList[]> {
    const select = await this.db
      .select({
        title: marketingProductMagazines.titulo,
        image_background: marketingProductMagazines.url_imagem,
      })
      .from(marketingProductMagazines)
      .where(and(eq(marketingProductMagazines.id_produto, productId)))
      .execute();

    if (!select?.length) {
      return [] as MarketingProductMagazinesList[];
    }

    return select as MarketingProductMagazinesList[];
  }
}
