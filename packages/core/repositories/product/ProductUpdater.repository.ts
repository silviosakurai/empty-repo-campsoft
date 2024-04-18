import { UpdateProductRequest } from "@core/useCases/product/dtos/UpdateProductRequest.dto";
import { product } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";

@injectable()
export class ProductUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(productId: string, input: UpdateProductRequest) {
    const result = await this.db
      .update(product)
      .set({
        status: input.status,
        id_produto_tipo: input.product_type_id,
        produto: input.name,
        descricao: input.long_description,
        descricao_curta: input.short_description,
        frases_marketing: input.marketing_phrases,
        conteudista_nome: input.content_provider_name,
        url_caminho: input.slug,
        preco: input.prices.price,
        preco_face: input.prices.face_value,
        obs: input.obs,
      })
      .where(eq(product.id_produto, productId))
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
