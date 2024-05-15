import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { plan, planPartner } from "@core/models";
import { eq, and, asc, desc, SQLWrapper, sql } from "drizzle-orm";
import { ListPlanRequest } from "@core/useCases/plan/dtos/ListPlanRequest.dto";
import { SortOrder } from "@core/common/enums/SortOrder";
import {
  GroupProductGroupMapper,
  Plan,
  PlanFields,
  PlanFieldsToOrder,
  PlanVisivelSite,
  ProductsGroups,
} from "@core/common/enums/models/plan";
import { setPaginationData } from "@core/common/functions/createPaginationData";
import { PlanPriceListerRepository } from "./PlanPriceLister.repository";
import { PlanItemListerRepository } from "./PlanItemLister.repository";
import { ProductListerRepository } from "../product/ProductLister.repository";
import { ProductGroupProductListerRepository } from "../product/ProductGroupProductLister.repository";
import { ListPlanResponse } from "@core/useCases/plan/dtos/ListPlanResponse.dto";
import { ViewPlanRepositoryDTO } from "@core/interfaces/repositories/plan";

@injectable()
export class PlanListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>,
    private readonly planPriceListerRepository: PlanPriceListerRepository,
    private readonly planItemListerRepository: PlanItemListerRepository,
    private readonly productListerRepository: ProductListerRepository,
    private readonly productGroupProductListerRepository: ProductGroupProductListerRepository
  ) {}

  async list(
    companyId: number,
    query: ListPlanRequest
  ): Promise<ListPlanResponse[] | null> {
    const filters = this.setFilters(query);

    const allQuery = this.db
      .select({
        plan_id: plan.id_plano,
        status: plan.status,
        visible_site: sql<boolean>`CASE 
            WHEN ${plan.visivel_site} = ${PlanVisivelSite.YES} THEN true
            ELSE false
          END`.mapWith(Boolean),
        business_id: planPartner.id_parceiro,
        plan: plan.plano,
        image: plan.imagem,
        description: plan.descricao,
        short_description: plan.descricao_curta,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
      })
      .from(plan)
      .innerJoin(planPartner, eq(planPartner.id_plano, plan.id_plano))
      .orderBy(this.setOrderBy(query.sort_by, query.sort_order))
      .where(and(eq(planPartner.id_parceiro, companyId), ...filters));

    const paginatedQuery = allQuery
      .limit(query.per_page)
      .offset((query.current_page - 1) * query.per_page);
    const plans: ViewPlanRepositoryDTO[] = await paginatedQuery.execute();

    if (!plans.length) {
      return null;
    }

    const plansCompleted = await this.getPlansRelactions(plans, companyId);

    return plansCompleted;
  }

  async listWithoutPagination(companyId: number): Promise<Plan[]> {
    const result = await this.db
      .select({
        plan_id: plan.id_plano,
        status: plan.status,
        visible_site: sql<boolean>`CASE 
          WHEN ${plan.visivel_site} = ${PlanVisivelSite.YES} THEN true
          ELSE false
        END`.mapWith(Boolean),
        business_id: planPartner.id_parceiro,
        plan: plan.plano,
        image: plan.imagem,
        description: plan.descricao,
        short_description: plan.descricao_curta,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
      })
      .from(plan)
      .innerJoin(planPartner, eq(planPartner.id_plano, plan.id_plano))
      .where(eq(planPartner.id_parceiro, companyId))
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
    const groupedProducts: GroupProductGroupMapper = {};

    products.forEach((product) => {
      const groupId = product.product_group_id;

      if (!groupedProducts[groupId]) {
        groupedProducts[groupId] = {
          product_group_id: groupId,
          name: product.name,
          quantity: product.quantity,
          available_products: [],
        };
      }

      groupedProducts[groupId].available_products.push(
        ...product.available_products
      );
    });

    return Object.values(groupedProducts);
  };

  private getPlansRelactions = async (
    plans: ViewPlanRepositoryDTO[],
    companyId: number
  ) => {
    const plansCompleted: Plan[] = [];

    for (const plan of plans) {
      const planItems = await this.planItemListerRepository.listByPlanId(
        plan.plan_id
      );
      const productIds = planItems.map((item) => item.product_id) as string[];

      const pricesPromise = this.planPriceListerRepository.listByPlanId(
        plan.plan_id
      );
      const productsPromise = this.productListerRepository.listByIds(
        companyId,
        productIds
      );
      const productGroupsPromise =
        this.productGroupProductListerRepository.listByProductsIds(productIds);

      const [prices, products, productGroups] = await Promise.all([
        pricesPromise,
        productsPromise,
        productGroupsPromise,
      ]);

      const groups = productGroups.map((group) => {
        return {
          product_group_id: group.product_group_id,
          name: group.name,
          quantity: group.quantity,
          available_products: products.filter(
            (product) => product.product_id === group.product_id
          ),
        };
      });

      const product_groups = this.groupProductsByGroupId(groups);

      plansCompleted.push({
        ...plan,
        prices,
        products,
        product_groups,
      });
    }

    return plansCompleted;
  };
}
