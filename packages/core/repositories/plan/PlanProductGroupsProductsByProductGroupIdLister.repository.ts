import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { product, productGroupProduct, productType } from "@core/models";
import { eq } from "drizzle-orm";
import { PlanProducts } from "@core/interfaces/repositories/voucher";

@injectable()
export class PlanProductGroupsProductsByProductGroupIdListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(productGroupId: number): Promise<PlanProducts[]> {
    const result = await this.db
      .select({
        product_id: productGroupProduct.id_produto,
        status: product.status,
        name: product.produto,
        long_description: product.descricao,
        short_description: product.descricao_curta,
        marketing_phrases: product.frases_marketing,
        content_provider_name: product.conteudista_nome,
        slug: product.url_caminho,
        images: {
          main_image: product.imagem,
          icon: product.icon,
          logo: product.logo,
          background_image: product.imagem_background,
        },
        product_type: {
          product_type_id: productType.id_produto_tipo,
          product_type_name: productType.produto_tipo,
        },
      })
      .from(productGroupProduct)
      .innerJoin(
        product,
        eq(product.id_produto, productGroupProduct.id_produto)
      )
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(eq(productGroupProduct.id_produto_grupo, productGroupId))
      .execute();

    if (result.length === 0) {
      return [];
    }

    return result as PlanProducts[];
  }
}