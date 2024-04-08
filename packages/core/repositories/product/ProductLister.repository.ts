import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { product, productCompany, productType } from "@core/models";
import { eq, and, asc, desc, SQLWrapper, inArray } from "drizzle-orm";
import { ProductResponse } from "@core/useCases/product/dtos/ProductResponse.dto";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { SortOrder } from "@core/common/enums/SortOrder";
import {
  ProductFields,
  ProductFieldsToOrder,
} from "@core/common/enums/models/product";
import { ListProductResponse } from "@core/useCases/product/dtos/ListProductResponse.dto";
import { setPaginationData } from "@core/common/functions/createPaginationData";

@injectable()
export class ProductListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    companyId: number,
    query: ListProductRequest
  ): Promise<ListProductResponse | null> {
    const filters = this.setFilters(query);

    const allQuery = this.db
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
        created_at: product.created_at,
        updated_at: product.updated_at,
      })
      .from(product)
      .innerJoin(
        productCompany,
        eq(product.id_produto, productCompany.id_produto)
      )
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .orderBy(this.setOrderBy(query.sort_by, query.sort_order))
      .where(and(eq(productCompany.id_empresa, companyId), ...filters));

    const totalResult = await allQuery.execute();

    const paginatedQuery = allQuery
      .limit(query.per_page)
      .offset((query.current_page - 1) * query.per_page);
    const totalPaginated = await paginatedQuery.execute();

    if (!totalPaginated.length) {
      return null;
    }

    const paging = setPaginationData(
      totalPaginated.length,
      totalResult.length,
      query.per_page,
      query.current_page
    );

    return {
      paging,
      results: totalPaginated as unknown as ProductResponse[],
    };
  }

  async listByIds(
    companyId: number,
    productIds: string[]
  ): Promise<ProductResponse[]> {
    const products = await this.db
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
        created_at: product.created_at,
        updated_at: product.updated_at,
      })
      .from(product)
      .innerJoin(
        productCompany,
        eq(product.id_produto, productCompany.id_produto)
      )
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(
        and(
          eq(productCompany.id_empresa, companyId),
          inArray(product.id_produto, productIds)
        )
      )
      .execute();

    return products as unknown as ProductResponse[];
  }

  private setFilters(query: ListProductRequest): SQLWrapper[] {
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