import * as schema from "@core/models";
import { productCompany } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";

@injectable()
export class ProductCompanyCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(productId: string, companyId: number):  Promise<boolean> {
    const result = await this.db
      .insert(productCompany)
      .values({
        id_produto: productId,
        id_empresa: companyId,
      })
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
