import * as schema from "@core/models";
import { productGroup } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import {
  UpdateProductGroupBodyRequest,
} from "@core/useCases/product/dtos/UpdateProductGroupRequest.dto";

@injectable()
export class ProductGroupUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(groupId: number, input: UpdateProductGroupBodyRequest) {
    const result = await this.db
      .update(productGroup)
      .set({
        produto_grupo: input.name,
        qtd_produtos_selecionaveis: input.choices,
      })
      .where(eq(productGroup.id_produto_grupo, groupId))
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
