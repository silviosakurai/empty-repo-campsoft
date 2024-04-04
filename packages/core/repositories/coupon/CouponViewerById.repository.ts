import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { couponCart, couponCartCode } from "@core/models/coupon";
import { and, eq } from "drizzle-orm";

@injectable()
export class CouponViewerByIdRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(couponId: number, companyId: number) {
    const result = await this.db
      .select({
        discount_coupon_value: couponCartCode.desconto_valor,
      })
      .from(couponCart)
      .innerJoin(
        couponCartCode,
        eq(couponCartCode.id_cupom_carrinho, couponCart.id_cupom_carrinho)
      )
      .groupBy(couponCartCode.id_cupom_carrinho_codigo)
      .where(
        and(
          eq(couponCart.id_cupom_carrinho, couponId),
          eq(couponCart.id_empresa, companyId)
        )
      );

    return result;
  }
}
