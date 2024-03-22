import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { plan } from "@core/models";
import { eq, and, asc, desc,SQLWrapper } from "drizzle-orm";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";
import { SortOrder } from "@core/common/enums/SortOrder";
import { Plan, PlanFields, PlanFieldsToOrder, ProductsGroups } from "@core/common/enums/models/plan";
import { setPaginationData } from "@core/common/functions/createPaginationData";
import { ListPlanPriceRepository } from "./ListPlanPrice.repository";
import { ListPlanItemRepository } from "./ListPlanItem.repository";
import { ListProductRepository } from "../product/ListProduct.repository";
import { ListProductGroupProductRepository } from "../product/ListProductGroupProduct.repository";
import { ListPlanResponse } from "@core/useCases/plan/dtos/ListPlanResponse.dto";
import { ProductResponse } from "@core/useCases/product/dtos/ProductResponse.dto";

@injectable()
export class ListPlanRepository {
  private db: MySql2Database<typeof schema>;
  private listPlanPriceRepository: ListPlanPriceRepository;
  private listPlanItemRepository: ListPlanItemRepository;
  private listProductRepository: ListProductRepository;
  private listProductGroupProductRepository: ListProductGroupProductRepository;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
    this.listPlanPriceRepository = new ListPlanPriceRepository(mySql2Database);
    this.listPlanItemRepository = new ListPlanItemRepository(mySql2Database);
    this.listProductRepository = new ListProductRepository(mySql2Database);
    this.listProductGroupProductRepository = new ListProductGroupProductRepository(mySql2Database);
  }

  async list(
    companyId: number,
    query: ListPlanRequest,
  ): Promise<ListPlanResponse | null> {

    const filters = this.setFilters(query);

    const allQuery = this.db
      .select(
        {
          plan_id: plan.id_plano,
          status: plan.status,
          visible_site: plan.visivel_site,
          business_id: plan.id_empresa,
          plan: plan.plano,
          image: plan.imagem,
          description: plan.descricao,
          short_description: plan.descricao_curta,
          created_at: plan.created_at,
          updated_at: plan.updated_at,
        }
      )
      .from(plan)
      .orderBy(this.setOrderBy(query.sort_by, query.sort_order))
      .where(
        and(
          eq(plan.id_empresa, companyId),
          ...filters
        ),
      );

    const totalResult = await allQuery.execute();
      
    const paginatedQuery = allQuery.limit(query.per_page).offset((query.current_page - 1) * query.per_page);
    const plans = await paginatedQuery.execute();

    if (!plans.length) {
      return null;
    }

    const plansCompleted = await this.getPlansRelactions(plans, companyId);

    const paging = setPaginationData(plans.length, totalResult.length, query.per_page, query.current_page);

    return {
      paging,
      results: plansCompleted,
    }
  }

  async listWithoutPagination(
    companyId: number,
  ): Promise<Plan[]> {

    const result = await this.db
      .select(
        {
          plan_id: plan.id_plano,
          status: plan.status,
          visible_site: plan.visivel_site,
          business_id: plan.id_empresa,
          plan: plan.plano,
          image: plan.imagem,
          description: plan.descricao,
          short_description: plan.descricao_curta,
          created_at: plan.created_at,
          updated_at: plan.updated_at,
        }
      )
      .from(plan)
      .where(
        eq(plan.id_empresa, companyId),
      )
      .execute();

    const plansCompleted = await this.getPlansRelactions(result, companyId);

    return plansCompleted;
  }

  private setFilters(query: ListPlanRequest): SQLWrapper[] {
    const filters: SQLWrapper[] = [];

    if (query.id) {
      filters.push(eq(plan.id_plano, query.id));
    }

    if (query.status) {
      filters.push(eq(plan.status, query.status));
    }

    if (query.plan) {
      filters.push(eq(plan.plano, query.plan));
    }

    if (query.description) {
      filters.push(eq(plan.descricao, query.description));
    }

    return filters;
  }

  private setOrderBy(sortBy?: PlanFields, sortOrder?: SortOrder) {
    const defaultOrderBy = asc(plan[PlanFieldsToOrder[PlanFields.plan_id]]);

    if (!sortBy) {
      return defaultOrderBy;
    }
    
    const fieldToOrder = PlanFieldsToOrder[sortBy];

    if (sortOrder === SortOrder.ASC) {
      return asc(plan[fieldToOrder]);
    }

    if (sortOrder === SortOrder.DESC) {
      return desc(plan[fieldToOrder]);
    }

    return defaultOrderBy;
  }

  private groupProductsByGroupId = (products: ProductsGroups[]) => {
    const groupedProducts: any = {};

    products.forEach((product) => {
      const groupId = product.product_group_id;

      if (!groupedProducts[groupId]) {
        groupedProducts[groupId] = {
          product_group_id: groupId,
          name: product.name,
          quantity: 0,
          available_products: []
        };
      }

      groupedProducts[groupId].quantity++;
      groupedProducts[groupId].available_products.push(product.available_products);
    });

    return Object.values(groupedProducts);
  }

  private getPlansRelactions = async (plans: any[], companyId: number) => {
    const plansCompleted: Plan[] = [];

    for (const plan of plans) {
      const planItems = await this.listPlanItemRepository.listByPlanId(plan.plan_id);
      const productIds = planItems.map(item => item.product_id) as string[];
      
      const pricesPromise = this.listPlanPriceRepository.listByPlanId(plan.plan_id);
      const productsPromise = this.listProductRepository.listByIds(companyId, productIds);
      const productGroupsPromise = this.listProductGroupProductRepository.listByProductsIds(productIds);

      const [ prices, products, productGroups ] = await Promise.all([
        pricesPromise,
        productsPromise,
        productGroupsPromise,
      ]);

      const groups = productGroups.map(group => {
        return {
          product_group_id: group.product_group_id,
					name: group.name,
					quantity: group.quantity,
          available_products: products.filter(product => product.product_id === group.product_id)
        }
      })

      const product_groups = this.groupProductsByGroupId(groups);

      plansCompleted.push({
        ...plan,
        prices,
        products,
        product_groups,
      });
    }

    return plansCompleted;
  }
}
