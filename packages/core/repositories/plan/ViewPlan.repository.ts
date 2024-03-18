import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { plan } from "@core/models";
import { eq, and } from "drizzle-orm";
import { Plan } from "@core/common/enums/models/plan";
import { ListPlanPriceRepository } from "./ListPlanPrice.repository";
import { ListPlanItemRepository } from "./ListPlanItem.repository";
import { ListProductRepository } from "../product/ListProduct.repository";
import { ListProductGroupProductRepository } from "../product/ListProductGroupProduct.repository";

@injectable()
export class ViewPlanRepository {
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

  async get(
    companyId: number,
    planId: number,
  ): Promise<Plan | null> {

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
        and(
          eq(plan.id_empresa, companyId),
          eq(plan.id_plano, planId),
        ),
      )
      .execute();

    if (!result.length) {
      return null;
    }

    const planCompleted = await this.getPlanRelactions(result[0], companyId);

    return planCompleted;
  }

  private getPlanRelactions = async (plan: any, companyId: number): Promise<Plan> => {
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

    return {
      ...plan,
      prices,
      products,
      product_groups,
    };
  }
}
