import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { product, productCompany, productType, company } from "@core/models";
import { eq, and, asc, desc, SQLWrapper, inArray } from "drizzle-orm";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { SortOrder } from "@core/common/enums/SortOrder";
import {
  ProductFields,
  ProductFieldsToOrder,
} from "@core/common/enums/models/product";
import { ListProductGroupedByCompany, ListProductGroupedByCompanyResponse } from "@core/useCases/product/dtos/ListProductResponse.dto";
import { setPaginationData } from "@core/common/functions/createPaginationData";
import { ProductDto, ProductDtoResponse } from "@core/interfaces/repositories/products";

@injectable()
export class ProductListerGroupedByCompanyRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    companyIds: number[],
    query: ListProductRequest
  ): Promise<ListProductGroupedByCompanyResponse | null> {
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
      .orderBy(this.setOrderBy(query.sort_by, query.sort_order))
      .where(
        and(
          inArray(productCompany.id_empresa, companyIds),
          ...filters
        )
      );

    const totalResult = await allQuery.execute();

    const paginatedQuery = allQuery
      .limit(query.per_page)
      .offset((query.current_page - 1) * query.per_page);
    const totalPaginated = await paginatedQuery.execute();

    if (!totalPaginated.length) {
      return null;
    }

    const bodyWithCompany = this.parseCompany(totalPaginated);
    
    const paging = setPaginationData(
      totalPaginated.length,
      totalResult.length,
      query.per_page,
      query.current_page
    );

    return {
      paging,
      results: bodyWithCompany as unknown as ListProductGroupedByCompany[],
    };
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
