import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { couponCartCode } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, sql } from "drizzle-orm";

@injectable()
export class CouponUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async updateCoupon(coupon: string): Promise<boolean> {
    const result = await this.db
      .update(couponCartCode)
      .set({
        qnt_uso_faltante: sql`${couponCartCode.qnt_uso_faltante} - 1`,
      })
      .where(and(eq(couponCartCode.cupom_carrinho_codigo, coupon)))
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
