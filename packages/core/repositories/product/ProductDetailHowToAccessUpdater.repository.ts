import { product } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { UpdateParams } from "@core/useCases/product/dtos/ProductDetaiHowToAccess.dto";

@injectable()
export class ProductDetailHowToAccessUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async updateDetailHowToAccess(
    productId: string,
    updateParams: UpdateParams
  ): Promise<boolean> {
    const result = await this.db
      .update(product)
      .set(updateParams)
      .where(eq(product.id_produto, productId))
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
