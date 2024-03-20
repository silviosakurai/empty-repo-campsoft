import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { couponRescueCode } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, gte } from "drizzle-orm";
import { CouponRescueCodeStatus } from "@core/common/enums/models/voucher";
import { IVerifyEligibilityUser } from "@core/interfaces/repositories/voucher";

@injectable()
export class VerifyVoucherEligibilityRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async verifyEligibilityUser(
    voucher: string
  ): Promise<IVerifyEligibilityUser | null> {
    const result = await this.db
      .select({
        cupom_resgatar_codigo: couponRescueCode.cupom_resgatar_codigo,
        qnt_uso_por_cli: couponRescueCode.qnt_uso_por_cli,
      })
      .from(couponRescueCode)
      .where(
        and(
          eq(couponRescueCode.cupom_resgatar_codigo, voucher),
          eq(couponRescueCode.status, CouponRescueCodeStatus.ACTIVE),
          gte(couponRescueCode.qnt_uso_faltante, 1)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as IVerifyEligibilityUser;
  }
}
