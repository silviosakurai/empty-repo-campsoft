import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { productGroup } from "@core/models";
import { eq } from "drizzle-orm";

@injectable()
export class ProductGroupImagesUrlUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(groupId: number, url: string) {
    const result = await this.db
      .update(productGroup)
      .set({
        icon: url,
      })
      .where(eq(productGroup.id_produto_grupo, groupId));

    if (!result[0].affectedRows) return false;

    return true;
  }
}
