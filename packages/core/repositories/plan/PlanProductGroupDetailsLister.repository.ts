import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import {
  plan,
  productGroupProduct,
  productGroup,
  planItem,
} from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { AvailableProducts } from "@core/interfaces/repositories/voucher";
import { PlanProductGroupsProductsByProductGroupIdListerRepository } from "./PlanProductGroupsProductsByProductGroupIdLister.repository";
import { FindOrderByNumberAvailableProducts } from "@core/useCases/order/dtos/FindOrderByNumberResponse.dto";

@injectable()
export class PlanProductGroupDetailsListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>,
    private readonly planProductGroupsProductsByProductGroupIdLister: PlanProductGroupsProductsByProductGroupIdListerRepository
  ) {}

  async list(
    planId: number,
    tokenKeyData: ITokenKeyData
  ): Promise<FindOrderByNumberAvailableProducts[]> {
    const results = await this.db
      .select({
        product_group_id: productGroup.id_produto_grupo,
        name: productGroup.produto_grupo,
        quantity: productGroup.qtd_produtos_selecionaveis,
      })
      .from(plan)
      .innerJoin(planItem, eq(plan.id_plano, planItem.id_plano))
      .innerJoin(
        productGroup,
        eq(productGroup.id_produto_grupo, planItem.id_produto_grupo)
      )
      .leftJoin(
        productGroupProduct,
        eq(productGroup.id_produto_grupo, productGroupProduct.id_produto_grupo)
      )
      .where(
        and(
          eq(plan.id_plano, planId),
          eq(plan.id_empresa, tokenKeyData.company_id)
        )
      )
      .groupBy(productGroupProduct.id_produto_grupo)
      .execute();

    if (results.length === 0) {
      return [];
    }

    const records = await this.complementWithAvailableProducts(results);

    return records;
  }

  private async complementWithAvailableProducts(
    result: AvailableProducts[]
  ): Promise<FindOrderByNumberAvailableProducts[]> {
    const productGroupsAsPromise = result.map(
      async (productGroups: AvailableProducts) => ({
        ...productGroups,
        selected_products:
          await this.planProductGroupsProductsByProductGroupIdLister.list(
            productGroups.product_group_id
          ),
      })
    );

    const productGroups = await Promise.all(productGroupsAsPromise);

    return productGroups;
  }
}
