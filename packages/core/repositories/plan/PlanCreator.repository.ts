import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { CreatePlanRequest } from "@core/useCases/plan/dtos/CreatePlanRequest.dto";
import { inArray, sql, eq } from "drizzle-orm";
import {
  PlanPriceCreate,
  PlanVisivelSite,
} from "@core/common/enums/models/plan";
import { Status } from "@core/common/enums/Status";

@injectable()
export class PlanCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(input: CreatePlanRequest): Promise<boolean> {
    const productIds = this.removeDuplicates(input.products);
    const productGroupIds = input.product_groups;

    const [productsExist, productGroupsExist, partnerExists] =
      await Promise.all([
        this.verifyProductsExistence(productIds),
        this.verifyProductGroupsExistence(productGroupIds),
        this.verifyPartnerExistence(input.business_id),
      ]);

    if (
      !productsExist ||
      !productGroupsExist ||
      !partnerExists ||
      productIds.length !== productGroupIds.length
    ) {
      return false;
    }

    const planId = await this.createPlan(input);
    if (planId === null) {
      return false;
    }

    const [pricesCreated, itemsCreated, partnerLinked] = await Promise.all([
      this.createPlanPrices(planId, input.prices as PlanPriceCreate[]),
      this.createPlanItems(planId, productIds),
      this.createPlanPartner(planId, input.business_id),
    ]);

    if (!pricesCreated || !itemsCreated || !partnerLinked) {
      await this.deletePlan(planId);
      return false;
    }

    return true;
  }

  private async createPlan(input: CreatePlanRequest): Promise<number | null> {
    try {
      const result = await this.db
        .insert(schema.plan)
        .values({
          visivel_site: input.visible_site
            ? PlanVisivelSite.YES
            : PlanVisivelSite.NO,
          descricao: input.description,
          descricao_curta: input.short_description,
          status: Status.ACTIVE,
        })
        .execute();

      return result[0]?.insertId ?? null;
    } catch (error) {
      return null;
    }
  }

  private createPlanPrices(planId: number, prices: PlanPriceCreate[]) {
    let isPlanPriceSaved = true;

    prices.map(async (price) => {
      const result = await this.db
        .insert(schema.planPrice)
        .values({
          id_plano: planId,
          desconto_porcentagem: price.discount_percentage,
          desconto_valor: price.discount_value,
          preco: price.price,
          meses: price.months,
        })
        .execute();

      if (!result.length) {
        isPlanPriceSaved = false;
      }
    });

    if (!isPlanPriceSaved) {
      this.deletePlan(planId);
      return false;
    }

    return true;
  }

  private async createPlanItems(planId: number, productIds: string[]) {
    let isPlanItemSaved = true;

    productIds.map(async (product) => {
      const result = await this.db
        .insert(schema.planItem)
        .values({
          id_plano: planId,
          id_produto: product,
        })
        .execute();

      if (!result.length) {
        isPlanItemSaved = false;
      }
    });

    if (!isPlanItemSaved) {
      this.deletePlan(planId);
      return false;
    }

    return true;
  }

  private async createPlanGroupItems(
    planId: number,
    productGroupIds: string[]
  ) {
    let isPlanItemSaved = true;

    productGroupIds.map(async (productGroup) => {
      const result = await this.db
        .insert(schema.planItem)
        .values({
          id_plano: planId,
          id_produto_grupo: parseInt(productGroup),
        })
        .execute();

      if (!result.length) {
        isPlanItemSaved = false;
      }
    });

    if (!isPlanItemSaved) {
      this.deletePlan(planId);
      return false;
    }

    return true;
  }

  private async createPlanPartner(
    planId: number,
    partnerId: number
  ): Promise<boolean> {
    const result = await this.db
      .insert(schema.planPartner)
      .values({
        id_plano: planId,
        id_parceiro: partnerId,
      })
      .execute();

    if (!result.length) {
      this.deletePlan(planId);
      return false;
    }
    return true;
  }

  private async deletePlan(planId: number) {
    await Promise.all([
      this.db
        .delete(schema.planPartner)
        .where(eq(schema.planPartner.id_plano, planId)),
      this.db
        .delete(schema.planItem)
        .where(eq(schema.planPartner.id_plano, planId)),
      this.db
        .delete(schema.planPrice)
        .where(eq(schema.planPartner.id_plano, planId)),
      this.db
        .delete(schema.plan)
        .where(eq(schema.planPartner.id_plano, planId)),
    ]);
  }

  async verifyPartnerExistence(partnerId: number) {
    const result = await this.db
      .select({ partner_id: schema.partner.id_parceiro })
      .from(schema.partner)
      .where(eq(schema.partner.id_parceiro, partnerId))
      .execute();

    return result.length > 0;
  }

  async verifyProductsExistence(productIds: string[]) {
    const result = await this.db
      .select({ product_id: schema.product.id_produto })
      .from(schema.product)
      .where(inArray(schema.product.id_produto, productIds))
      .execute();

    return result.length === productIds.length;
  }

  async verifyProductGroupsExistence(productGroupsIds: string[]) {
    const result = await this.db
      .select({ product_group_id: schema.productGroup.id_produto_grupo })
      .from(schema.productGroup)
      .where(inArray(sql`id_produto_grupo`.mapWith(String), productGroupsIds))
      .execute();

    return result.length === productGroupsIds.length;
  }

  private removeDuplicates(items: string[]): string[] {
    return [...new Set(items)];
  }
}
