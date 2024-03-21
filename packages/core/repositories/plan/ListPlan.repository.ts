import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { plan } from "@core/models";
import { eq, and, asc, desc,SQLWrapper } from "drizzle-orm";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";
import { SortOrder } from "@core/common/enums/SortOrder";
import { Plan, PlanFields, PlanFieldsToOrder } from "@core/common/enums/models/plan";
import { setPaginationData } from "@core/common/functions/createPaginationData";
import { ListPlanPriceRepository } from "./ListPlanPrice.repository";
import { ListPlanItemRepository } from "./ListPlanItem.repository";
import { ListProductRepository } from "../product/ListProduct.repository";
import { ListProductGroupProductRepository } from "../product/ListProductGroupProduct.repository";
import { ListPlanResponse } from "@core/useCases/plan/dtos/ListPlanResponse.dto";

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
    query: ListPlanRequest
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

      const product_groups = productGroups.map(group => {
        return {
          product_group_id: group.product_group_id,
					name: group.name,
					quantity: group.quantity,
          available_products: products.filter(product => product.product_id === group.product_id)
        }
      })

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
