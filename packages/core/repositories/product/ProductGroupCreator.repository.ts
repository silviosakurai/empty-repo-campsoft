import * as schema from "@core/models";
import { productGroup } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";

@injectable()
export class ProductGroupCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(name: string, choices: number): Promise<boolean> {
    const result = await this.db
      .insert(productGroup)
      .values({
        produto_grupo: name,
        qtd_produtos_selecionaveis: choices,
      })
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
