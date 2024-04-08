import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { couponRescueCode } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, sql } from "drizzle-orm";
import { CouponRescueCodeStatus } from "@core/common/enums/models/voucher";

@injectable()
export class VoucherUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async updateVoucher(voucher: string): Promise<boolean> {
    const result = await this.db
      .update(couponRescueCode)
      .set({
        qnt_uso_faltante: sql`${couponRescueCode.qnt_uso_faltante} - 1`,
      })
      .where(
        and(
          eq(couponRescueCode.cupom_resgatar_codigo, voucher),
          eq(couponRescueCode.status, CouponRescueCodeStatus.ACTIVE)
        )
      )
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
