import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { product, productPartner, productType, partner } from "@core/models";
import { eq, and, inArray, count, SQL, asc, desc } from "drizzle-orm";
import {
  ListProductGroupedByCompany,
  ProductList,
} from "@core/useCases/product/dtos/ListProductResponse.dto";
import { ProductResponse } from "@core/useCases/product/dtos/ProductResponse.dto";
import { ListProductByCompanyRequest } from "@core/useCases/product/dtos/ListProductByCompanyRequest.dto";
import { SetOrderByFunction } from "@core/useCases/client/dtos/ListClientRequest.dto";
import { ProductOrderPartner } from "@core/common/enums/models/product";
import { SortOrder } from "@core/common/enums/SortOrder";

@injectable()
export class ProductListerGroupedByCompanyRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    query: ListProductByCompanyRequest,
    listPartnersIds: number[]
  ): Promise<ListProductGroupedByCompany[]> {
    const filters = this.setFilters(query, listPartnersIds);
    const orderBy = this.setOrderBy(query);

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
        obs: product.obs,
        created_at: product.created_at,
        updated_at: product.updated_at,
      })
      .from(product)
      .innerJoin(
        productPartner,
        eq(product.id_produto, productPartner.id_produto)
      )
      .innerJoin(partner, eq(partner.id_parceiro, productPartner.id_parceiro))
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(filters)
      .orderBy(orderBy)
      .groupBy(product.id_produto);

    const paginatedQuery = allQuery
      .limit(query.per_page)
      .offset((query.current_page - 1) * query.per_page);
    const totalPaginated = await paginatedQuery.execute();

    if (!totalPaginated.length) {
      return [] as ListProductGroupedByCompany[];
    }

    return this.enrichCompany(totalPaginated, listPartnersIds);
  }

  async listByIds(productIds: string[]): Promise<ProductResponse[]> {
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
      .where(and(inArray(product.id_produto, productIds)))
      .execute();

    return products as unknown as ProductResponse[];
  }

  async countTotalCompanies(
    query: ListProductByCompanyRequest,
    listPartnersIds: number[]
  ): Promise<number> {
    const filters = this.setFilters(query, listPartnersIds);

    const countResult = await this.db
      .select({
        count: count(),
      })
      .from(product)
      .innerJoin(
        productPartner,
        eq(product.id_produto, productPartner.id_produto)
      )
      .innerJoin(partner, eq(partner.id_parceiro, productPartner.id_parceiro))
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(filters)
      .groupBy(product.id_produto)
      .execute();

    return countResult[0].count;
  }

  private async enrichCompany(
    result: ProductList[],
    listPartnersIds: number[]
  ) {
    const enrichCompanyPromises = result.map(async (product: ProductList) => ({
      ...product,
      companies: await this.fetchCompanies(product.product_id, listPartnersIds),
    }));

    return Promise.all(enrichCompanyPromises);
  }

  private async fetchCompanies(productId: string, listPartnersIds: number[]) {
    const positionsQuery = this.db
      .select({
        company_id: partner.id_parceiro,
        company_name: partner.nome_fantasia,
      })
      .from(partner)
      .innerJoin(
        productPartner,
        eq(productPartner.id_parceiro, partner.id_parceiro)
      )
      .where(
        and(
          inArray(productPartner.id_parceiro, listPartnersIds),
          eq(productPartner.id_produto, productId)
        )
      );

    return positionsQuery;
  }

  private setFilters(
    query: ListProductByCompanyRequest,
    listPartnersIds: number[]
  ): SQL<unknown> | undefined {
    let filters = and(inArray(productPartner.id_parceiro, listPartnersIds));

    if (query.id) {
      filters = and(filters, eq(product.id_produto, query.id));
    }

    if (query.company_id) {
      filters = and(
        filters,
        inArray(productPartner.id_parceiro, query.company_id)
      );
    }

    if (query.status) {
      filters = and(filters, eq(product.status, query.status));
    }

    if (query.name) {
      filters = and(filters, eq(product.produto, query.name));
    }

    if (query.description) {
      filters = and(filters, eq(product.descricao, query.description));
    }

    if (query.product_type_id) {
      filters = and(
        filters,
        eq(product.id_produto_tipo, query.product_type_id)
      );
    }

    if (query.slug) {
      filters = and(filters, eq(product.url_caminho, query.slug));
    }

    return filters;
  }

  private setOrderBy(query: ListProductByCompanyRequest): SQL<unknown> {
    const orderByMapping: {
      [key in ProductOrderPartner | "default"]: SetOrderByFunction;
    } = {
      [ProductOrderPartner.product_id]: () =>
        query.sort_order === SortOrder.ASC
          ? asc(product.id_produto)
          : desc(product.id_produto),

      [ProductOrderPartner.name]: () =>
        query.sort_order === SortOrder.ASC
          ? asc(product.produto)
          : desc(product.produto),

      [ProductOrderPartner.slug]: () =>
        query.sort_order === SortOrder.ASC
          ? asc(product.url_caminho)
          : desc(product.url_caminho),

      [ProductOrderPartner.status]: () =>
        query.sort_order === SortOrder.ASC
          ? asc(product.status)
          : desc(product.status),

      [ProductOrderPartner.content_provider_name]: () =>
        query.sort_order === SortOrder.ASC
          ? asc(product.conteudista_nome)
          : desc(product.conteudista_nome),

      default: () =>
        query.sort_order === SortOrder.ASC
          ? asc(product.created_at)
          : desc(product.created_at),
    };

    return orderByMapping[query.sort_by ?? "default"]();
  }
}
