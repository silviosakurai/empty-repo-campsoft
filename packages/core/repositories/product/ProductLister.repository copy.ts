import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { product, productPartner, productType } from "@core/models";
import { eq, and, asc, desc, SQLWrapper, inArray } from "drizzle-orm";
import { ListAllProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { SortOrder } from "@core/common/enums/SortOrder";
import {
  ProductFields,
  ProductFieldsToOrder,
} from "@core/common/enums/models/product";
import { ProductListerNoPagination } from "@core/useCases/product/dtos/ListProductResponse.dto";

@injectable()
export class ProductListerNoPaginationRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    companyId: number,
    query: ListAllProductRequest
  ): Promise<ProductListerNoPagination[]> {
    const filters = this.setFilters(query);

    const result = await this.db
      .select({
        product_id: product.id_produto,
        status: product.status,
        name: product.produto,
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
      .orderBy(this.setOrderBy(query.sort_by, query.sort_order))
      .where(and(eq(productPartner.id_parceiro, companyId), ...filters));

    if (!result.length) {
      return [] as ProductListerNoPagination[];
    }

    return result as ProductListerNoPagination[];
  }

  private setFilters(query: ListAllProductRequest): SQLWrapper[] {
    const filters: SQLWrapper[] = [];

    if (query.id) {
      filters.push(eq(product.id_produto, query.id));
    }

    if (query.status) {
      filters.push(eq(product.status, query.status));
    }

    if (query.name) {
      filters.push(eq(product.produto, query.name));
    }

    if (query.description) {
      filters.push(eq(product.descricao, query.description));
    }

    if (query.product_type) {
      filters.push(eq(productType.produto_tipo, query.product_type));
    }

    if (query.slug) {
      filters.push(eq(product.url_caminho, query.slug));
    }

    return filters;
  }

  private setOrderBy(sortBy?: ProductFields, sortOrder?: SortOrder) {
    const defaultOrderBy = asc(
      product[ProductFieldsToOrder[ProductFields.name]]
    );

    if (!sortBy) {
      return defaultOrderBy;
    }

    const fieldToOrder = ProductFieldsToOrder[sortBy];

    if (sortOrder === SortOrder.ASC) {
      return asc(product[fieldToOrder]);
    }

    if (sortOrder === SortOrder.DESC) {
      return desc(product[fieldToOrder]);
    }

    return defaultOrderBy;
  }
}
