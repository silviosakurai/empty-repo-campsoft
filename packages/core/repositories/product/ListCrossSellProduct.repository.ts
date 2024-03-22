import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { CrossSellProductRequest } from "@core/useCases/product/dtos/ListCrossSellProductRequest.dto";
import { product, productType, productCrossSell } from "@core/models";
import { SQLWrapper, and, asc, desc, eq, like, ne, sql } from "drizzle-orm";
import { setPaginationData } from "@core/common/functions/createPaginationData";
import { ProductResponse } from "@core/useCases/product/dtos/ProductResponse.dto";
import { ListProductResponse } from "@core/useCases/product/dtos/ListProductResponse.dto";
import {
  ProductFields,
  ProductFieldsToOrder,
} from "@core/common/enums/models/product";
import { SortOrder } from "@core/common/enums/SortOrder";

@injectable()
export class ListCrossSellProductRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async list(
    input: CrossSellProductRequest
  ): Promise<ListProductResponse | null> {
    const filters = this.setFilters(input);

    const allQuery = this.db
      .select({
        product_id: productCrossSell.id_produto,
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
        price: {
          months: productCrossSell.meses,
          price: sql<number>`CAST(${product.preco_face} AS DECIMAL(10,2))`,
          price_with_discount: sql<number>`CAST(${productCrossSell.preco_desconto} AS DECIMAL(10,2))`,
        },
        created_at: product.created_at,
        updated_at: product.updated_at,
      })
      .from(productCrossSell)
      .innerJoin(product, eq(productCrossSell.id_produto, product.id_produto))
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .orderBy(this.setOrderBy(input.sort_by, input.sort_order))
      .groupBy(product.id_produto)
      .where(and(ne(productCrossSell.id_plano, input.plan_id), ...filters));

    const paginatedQuery = allQuery
      .limit(input.per_page)
      .offset(input.current_page * input.per_page);

    const records = await paginatedQuery.execute();

    if (!records.length) {
      return null;
    }

    const totalResult = await allQuery.execute();

    const paging = setPaginationData(
      records.length,
      totalResult.length,
      input.per_page,
      input.current_page
    );

    return {
      paging,
      results: records as unknown as ProductResponse[],
    };
  }

  private setFilters(
    input: Omit<CrossSellProductRequest, "client_id" | "plan_id">
  ) {
    const filters: SQLWrapper[] = [];

    if (input.id) {
      filters.push(like(product.id_produto, `%${input.id}%`));
    }

    if (input.name) {
      filters.push(like(product.produto, `%${input.name}%`));
    }

    if (input.description) {
      filters.push(like(product.descricao, `%${input.description}%`));
    }

    if (input.product_type) {
      filters.push(like(productType.produto_tipo, `%${input.product_type}%`));
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
