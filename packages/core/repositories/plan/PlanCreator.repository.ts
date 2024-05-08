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
    const [productsIds, productGroupsIds] = [
      this.removeDuplicatesValuesFromArray(input.products),
      input.product_groups,
    ];

    const [checkProductsIds, checkProductGroupsIds, checkPartner] =
      await Promise.all([
        this.checkIfProductsExists(productsIds),
        this.checkIfProductGroupsExists(productGroupsIds),
        this.checkIfPartnerExists(input.business_id),
      ]);

    if (
      !checkProductsIds ||
      !checkProductGroupsIds ||
      !checkPartner ||
      productsIds.length !== productGroupsIds.length
    ) {
      return false;
    }

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

    if (!result.length) {
      return false;
    }

    const [isPlanPriceCreated, isPlanItemCreated, isPlanPartnerCreated] =
      await Promise.all([
        this.createPlanPrices(
          result[0].insertId,
          input.prices as PlanPriceCreate[]
        ),
        this.createPlanItens(result[0].insertId, productsIds, productGroupsIds),
        this.createPlanPartner(result[0].insertId, input.business_id),
      ]);

    if (!isPlanPriceCreated || !isPlanItemCreated || !isPlanPartnerCreated) {
      return false;
    }
    return true;
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

  private async createPlanItens(
    planId: number,
    productIds: string[],
    productGroupIds: string[]
  ) {
    let isPlanItemSaved = true;

    for (var i = 0; i < productIds.length; i++) {
      const result = await this.db
        .insert(schema.planItem)
        .values({
          id_plano: planId,
          id_produto: productIds[i],
          id_produto_grupo: parseInt(productGroupIds[i]),
        })
        .execute();

      if (!result.length) {
        isPlanItemSaved = false;
      }
    }

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

  async checkIfPartnerExists(partnerId: number) {
    const result = await this.db
      .select({ partner_id: schema.partner.id_parceiro })
      .from(schema.partner)
      .where(eq(schema.partner.id_parceiro, partnerId))
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }

  async checkIfProductsExists(productIds: string[]) {
    const result = await this.db
      .select({ product_id: schema.product.id_produto })
      .from(schema.product)
      .where(inArray(schema.product.id_produto, productIds))
      .execute();

    if (result.length < productIds.length) {
      return false;
    }

    return true;
  }

  async checkIfProductGroupsExists(productGroupsIds: string[]) {
    const result = await this.db
      .select({ product_group_id: schema.productGroup.id_produto_grupo })
      .from(schema.productGroup)
      .where(inArray(sql`id_produto_grupo`.mapWith(String), productGroupsIds))
      .execute();

    if (result.length < productGroupsIds.length) {
      return false;
    }

    return true;
  }

  private removeDuplicatesValuesFromArray(ids: string[]) {
    const uniqueSet = new Set(ids);
    return Array.from(uniqueSet);
  }
}
