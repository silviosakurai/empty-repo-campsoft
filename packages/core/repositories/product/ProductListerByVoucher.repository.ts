import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import {
  couponRescue,
  couponRescueCode,
  couponRescueItem,
  planItem,
} from "@core/models";
import { eq, and, gte, or, isNull, sql } from "drizzle-orm";
import { currentTime } from "@core/common/functions/currentTime";
import { ProductListerByVoucher } from "@core/interfaces/repositories/products";

@injectable()
export class ProductListerByVoucherRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    partnerId: number,
    voucher: string
  ): Promise<ProductListerByVoucher[]> {
    const validUntil = currentTime();

    const select = await this.db
      .select({
        coupon_rescue_code: couponRescueCode.id_cupom_resgatar_codigo,
        product_id: sql<string>`CASE 
          WHEN ${planItem.id_plano} IS NOT NULL 
            THEN ${planItem.id_produto} 
          ELSE ${couponRescueItem.id_produto} 
        END`,
      })
      .from(couponRescueCode)
      .innerJoin(
        couponRescue,
        and(
          eq(
            couponRescue.id_cupom_resgatar,
            couponRescueCode.id_cupom_resgatar
          ),
          eq(couponRescue.id_parceiro, partnerId)
        )
      )
      .innerJoin(
        couponRescueItem,
        eq(couponRescueItem.id_cupom_resgatar, couponRescue.id_cupom_resgatar)
      )
      .leftJoin(planItem, eq(planItem.id_plano, couponRescueItem.id_plano))
      .where(
        and(
          eq(couponRescueCode.cupom_resgatar_codigo, voucher),
          or(
            gte(couponRescueItem.validade_ate, validUntil),
            isNull(couponRescueItem.validade_ate)
          )
        )
      )
      .groupBy(planItem.id_produto, couponRescueItem.id_produto)
      .execute();

    if (!select.length) {
      return [] as ProductListerByVoucher[];
    }

    return select as ProductListerByVoucher[];
  }
}
