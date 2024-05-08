import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { CreatePlanRequest } from "@core/useCases/plan/dtos/CreatePlanRequest.dto";
import { inArray, sql } from "drizzle-orm";
import {
  PlanPriceCreate,
  PlanVisivelSite,
} from "@core/common/enums/models/plan";

@injectable()
export class PlanCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(input: CreatePlanRequest): Promise<boolean> {
    const [productsIds, productGroupsIds] = [
      this.removeDuplicatesValuesFromArray(input.products),
      this.removeDuplicatesValuesFromArray(input.product_groups),
    ];

    const [checkProductsIds, checkProductGroupsIds] = await Promise.all([
      this.checkIfProductsExists(productsIds),
      this.checkIfProductGroupsExists(productGroupsIds),
    ]);

    if (!checkProductsIds || !checkProductGroupsIds) {
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
      })
      .execute();

    if (!result.length) {
      return false;
    }

    this.createPlanPrices(
      result[0].insertId,
      input.prices as PlanPriceCreate[]
    );
    this.createPlanItens(result[0].insertId, productsIds);
    return true;
  }

  private createPlanPrices(planId: number, prices: PlanPriceCreate[]) {
    prices.map(async (price) => {
      await this.db
        .insert(schema.planPrice)
        .values({
          id_plano: planId,
          desconto_porcentagem: price.discount_percentage,
          desconto_valor: price.discount_value,
          preco: price.price,
          meses: price.months,
        })
        .execute();
    });
  }

  private createPlanItens(planId: number, itens: string[]) {
    itens.map(async (item) => {
      await this.db
        .insert(schema.planItem)
        .values({
          id_plano: planId,
          id_produto: item,
        })
        .execute();
    });
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
