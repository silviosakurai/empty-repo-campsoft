import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { marketingProductInstitutional } from "@core/models";
import { eq, and } from "drizzle-orm";
import { MarketingProductInstitucionalList } from "@core/interfaces/repositories/marketing";

@injectable()
export class MarketingProductInstitucionalListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(productId: string): Promise<MarketingProductInstitucionalList[]> {
    const select = await this.db
      .select({
        title: marketingProductInstitutional.titulo,
        description: marketingProductInstitutional.descricao,
        image_background: marketingProductInstitutional.url_imagem,
        video_url: marketingProductInstitutional.url_video,
      })
      .from(marketingProductInstitutional)
      .where(and(eq(marketingProductInstitutional.id_produto, productId)))
      .execute();

    if (!select?.length) {
      return [] as MarketingProductInstitucionalList[];
    }

    return select as MarketingProductInstitucionalList[];
  }
}
