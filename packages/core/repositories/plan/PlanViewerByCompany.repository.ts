import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { plan, planPartner } from "@core/models";
import { eq, and, sql, inArray } from "drizzle-orm";
import { Plan, PlanVisivelSite } from "@core/common/enums/models/plan";
import { PlanPriceListerRepository } from "./PlanPriceLister.repository";
import { PlanItemListerRepository } from "./PlanItemLister.repository";
import { ProductGroupProductListerRepository } from "../product/ProductGroupProductLister.repository";
import { ViewPlanRepositoryDTO } from "@core/interfaces/repositories/plan";
import { ProductListerGroupedByCompanyRepository } from "../product/ProductListerGroupedByCompany.repository";

@injectable()
export class PlanViewerByCompanyRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>,
    private readonly planPriceListerRepository: PlanPriceListerRepository,
    private readonly planItemListerRepository: PlanItemListerRepository,
    private readonly productListerGroupedByCompanyRepository: ProductListerGroupedByCompanyRepository,
    private readonly productGroupProductListerRepository: ProductGroupProductListerRepository
  ) {}

  async get(
    partnerIds: number[],
    planId: number,
  ): Promise<Plan | null> {
    const result: ViewPlanRepositoryDTO[] = await this.db
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
      .where(
        and(
          inArray(planPartner.id_parceiro, partnerIds),
          eq(plan.id_plano, planId)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    const planCompleted = await this.getPlanRelactions(result[0]);

    return planCompleted;
  }

  private getPlanRelactions = async (
    plan: ViewPlanRepositoryDTO
  ): Promise<Plan> => {
    const planItems = await this.planItemListerRepository.listByPlanId(
      plan.plan_id
    );
    const productIds = planItems.map((item) => item.product_id) as string[];

    const pricesPromise = this.planPriceListerRepository.listByPlanId(
      plan.plan_id
    );
    const productsPromise =
      this.productListerGroupedByCompanyRepository.listByIds(productIds);
    const productGroupsPromise =
      this.productGroupProductListerRepository.listByProductsIds(productIds);

    const [prices, products, productGroups] = await Promise.all([
      pricesPromise,
      productsPromise,
      productGroupsPromise,
    ]);

    const product_groups = productGroups.map((group) => {
      return {
        product_group_id: group.product_group_id,
        name: group.name,
        quantity: group.quantity,
        available_products: products.filter(
          (product) => product.product_id === group.product_id
        ),
      };
    });

    return {
      ...plan,
      prices,
      products,
      product_groups,
    };
  };
}
