import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { CrossSellProductRequest } from "@core/useCases/product/dtos/ListCrossSellProductRequest.dto";
import { plan, product, productType, productCrossSell } from "@core/models";
import {
  SQLWrapper,
  and,
  asc,
  desc,
  eq,
  inArray,
  like,
  ne,
  sql,
} from "drizzle-orm";
import { setPaginationData } from "@core/common/functions/createPaginationData";
import { ListProductResponseCrossSell } from "@core/useCases/product/dtos/ListProductResponse.dto";
import {
  ProductFields,
  ProductFieldsToOrder,
} from "@core/common/enums/models/product";
import { SortOrder } from "@core/common/enums/SortOrder";
import { ProductResponseCrossSell } from "@core/useCases/product/dtos/ProductResponse.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import {
  PlanPriceCrossSellOrder,
  PlanProduct,
} from "@core/interfaces/repositories/plan";

@injectable()
export class CrossSellProductListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    input: CrossSellProductRequest
  ): Promise<ListProductResponseCrossSell | null> {
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
        prices: {
          months: productCrossSell.meses,
          price:
            sql<number>`CAST(${product.preco_face} AS DECIMAL(10,2))`.mapWith(
              Number
            ),
          price_with_discount:
            sql<number>`CAST(${productCrossSell.preco_desconto} AS DECIMAL(10,2))`.mapWith(
              Number
            ),
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
      .offset((input.current_page - 1) * input.per_page);

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
      results: records as unknown as ProductResponseCrossSell[],
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

  async findPlanProductCrossSell(
    tokenKeyData: ITokenKeyData,
    planId: number,
    months: number,
    selectedProducts: string[]
  ): Promise<PlanProduct[]> {
    const result = await this.db
      .selectDistinct({
        plan_id: productCrossSell.id_plano,
        product_id: productCrossSell.id_produto,
        name: plan.plano,
      })
      .from(productCrossSell)
      .innerJoin(plan, eq(productCrossSell.id_plano, plan.id_plano))
      .where(
        and(
          eq(productCrossSell.id_plano, planId),
          eq(productCrossSell.meses, months),
          inArray(productCrossSell.id_produto, selectedProducts),
          eq(plan.id_empresa, tokenKeyData.company_id)
        )
      )
      .groupBy(productCrossSell.id_produto)
      .execute();

    if (result.length === 0) {
      return [] as PlanProduct[];
    }

    return result as unknown as PlanProduct[];
  }

  async findPlanPriceProductCrossSell(
    tokenKeyData: ITokenKeyData,
    planId: number,
    months: number,
    selectedProducts: string[]
  ): Promise<PlanPriceCrossSellOrder[]> {
    const result = await this.db
      .selectDistinct({
        product_id: productCrossSell.id_produto,
        price_discount: sql`IFNULL(${productCrossSell.preco_desconto}, ${product.preco})`,
      })
      .from(productCrossSell)
      .innerJoin(plan, eq(productCrossSell.id_plano, plan.id_plano))
      .innerJoin(product, eq(productCrossSell.id_produto, product.id_produto))
      .where(
        and(
          eq(productCrossSell.id_plano, planId),
          eq(productCrossSell.meses, months),
          inArray(productCrossSell.id_produto, selectedProducts),
          eq(plan.id_empresa, tokenKeyData.company_id)
        )
      )
      .groupBy(productCrossSell.id_produto)
      .execute();

    if (result.length === 0) {
      return [] as PlanPriceCrossSellOrder[];
    }

    return result as PlanPriceCrossSellOrder[];
  }
}
