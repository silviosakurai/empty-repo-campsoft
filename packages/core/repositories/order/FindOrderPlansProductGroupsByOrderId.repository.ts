import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import {
  productGroup,
  productGroupProduct,
  planItem,
  plan,
  orderItem,
  order,
} from "@core/models";
import { and, eq, sql } from "drizzle-orm";

@injectable()
export class FindOrderPlansProductGroupsByOrderIdRepository {
  constructor(@inject("Database") private db: MySql2Database<typeof schema>) {}

  async find(orderId: string) {
    const result = await this.db
      .select({
        product_group_id: productGroup.id_produto_grupo,
        name: productGroup.produto_grupo,
        quantity: sql<number>`COUNT(${productGroupProduct.id_produto_grupo})`,
      })
      .from(productGroup)
      .innerJoin(
        planItem,
        eq(planItem.id_produto_grupo, productGroup.id_produto_grupo)
      )
      .innerJoin(plan, eq(plan.id_plano, planItem.id_plano))
      .innerJoin(orderItem, eq(orderItem.id_plano, plan.id_plano))
      .innerJoin(order, eq(order.id_pedido, orderItem.id_pedido))
      .leftJoin(
        productGroupProduct,
        eq(productGroup.id_produto_grupo, productGroupProduct.id_produto_grupo)
      )
      .where(and(eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .groupBy(productGroupProduct.id_produto_grupo)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result;
  }
}
