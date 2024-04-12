import { eq, and } from "drizzle-orm";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { product, productCompany, productType, company } from "@core/models";
import { ProductDto, ProductDtoResponse } from "@core/interfaces/repositories/products";
import { ListProductGroupedByCompany } from "@core/useCases/product/dtos/ListProductResponse.dto";
import { inArray } from "drizzle-orm";

@injectable()
export class ProductViewerGroupedByCompanyRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(
    companyIds: number[],
    sku: string,
  ): Promise<ListProductGroupedByCompany | null> {
    const results = await this.db
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
        company_id: productCompany.id_empresa,
        company_name: company.nome_fantasia,
      })
      .from(product)
      .innerJoin(
        productCompany,
        eq(product.id_produto, productCompany.id_produto)
      )
      .innerJoin(
        company,
        eq(company.id_empresa, productCompany.id_empresa)
      )
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(
        and(
          inArray(productCompany.id_empresa, companyIds),
          eq(product.id_produto, sku),
        )
      )
      .execute();

    if (!results.length) {
      return null;
    }

    const bodyWithCompany = this.parseCompany(results);

    return bodyWithCompany[0] as unknown as ListProductGroupedByCompany;
  }

  private parseCompany(products: ProductDto[]): ProductDtoResponse[] {
    const productsParsed: any  = {};

    products.forEach(product => {
      if (!productsParsed[product.product_id]) {
        productsParsed[product.product_id] = {
          ...product,
          companies: [] as any,
        };
      }
      productsParsed[product.product_id].companies.push({
        company_id: product.company_id,
        company_name: product.company_name
      });

      delete productsParsed[product.product_id].company_id
      delete productsParsed[product.product_id].company_name
    });

    return Object.values(productsParsed);
  }
}
