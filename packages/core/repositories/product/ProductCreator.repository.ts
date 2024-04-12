import { product } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { CreateProductRequest } from "@core/useCases/product/dtos/CreateProductRequest.dto";

@injectable()
export class ProductCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(input: CreateProductRequest):  Promise<boolean> {
    const result = await this.db
      .insert(product)
      .values({
        id_produto: input.product_id,
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
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
