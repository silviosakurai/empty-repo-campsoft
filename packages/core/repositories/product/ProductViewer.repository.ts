import * as schema from "@core/models";
import { eq, and } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { product, productPartner, productType } from "@core/models";
import { ProductResponse } from "@core/useCases/product/dtos/ProductResponse.dto";

@injectable()
export class ProductViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async get(companyId: number, sku: string): Promise<ProductResponse | null> {
    const result = await this.db
      .select({
        product_id: product.id_produto,
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
        how_to_access: {
          desktop: product.como_acessar_desk,
          mobile: product.como_acessar_mob,
          url_web: product.como_acessar_url,
          url_ios: product.como_acessar_url_ios,
          url_android: product.como_acessar_url_and,
        },
        product_type: {
          product_type_id: productType.id_produto_tipo,
          product_type_name: productType.produto_tipo,
        },
        prices: {
          face_value: product.preco_face,
          price: product.preco,
        },
        created_at: product.created_at,
        updated_at: product.updated_at,
      })
      .from(product)
      .innerJoin(
        productPartner,
        eq(product.id_produto, productPartner.id_produto)
      )
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(
        and(
          eq(productPartner.id_parceiro, companyId),
          eq(product.id_produto, sku)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ProductResponse;
  }
}
