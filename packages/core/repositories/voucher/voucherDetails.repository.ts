import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { couponRescueCode, couponRescue, couponRescueItem } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, gte, isNotNull } from "drizzle-orm";
import { CouponRescueCodeStatus } from "@core/common/enums/models/voucher";
import { IGetVoucherInfo } from "@core/interfaces/repositories/voucher";
import { CouponRescueItemTypeTime } from "@core/common/enums/models/coupon";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { currentTime } from "@core/common/functions/currentTime";

@injectable()
export class VoucherDetailsRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async getVoucherDetails(
    tokenKeyData: ITokenKeyData,
    voucher: string
  ): Promise<IGetVoucherInfo | null> {
    const result = await this.db
      .select({
        status: couponRescue.status,
        name: couponRescue.cupom_resgatar,
        expires_at: couponRescue.validade,
        code: couponRescueCode.cupom_resgatar_codigo,
        months: couponRescueItem.tempo,
      })
      .from(couponRescueCode)
      .innerJoin(
        couponRescue,
        eq(couponRescue.id_cupom_resgatar, couponRescueCode.id_cupom_resgatar)
      )
      .innerJoin(
        couponRescueItem,
        eq(couponRescueItem.id_cupom_resgatar, couponRescue.id_cupom_resgatar)
      )
      .where(
        and(
          eq(couponRescueCode.cupom_resgatar_codigo, voucher),
          eq(couponRescueCode.status, CouponRescueCodeStatus.ACTIVE),
          eq(couponRescue.id_parceiro, tokenKeyData.id_parceiro),
          eq(couponRescueItem.tempo_tipo, CouponRescueItemTypeTime.MONTH),
          isNotNull(couponRescueItem.id_plano)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as IGetVoucherInfo;
  }

  async getPlanVoucher(
    partnerId: number,
    voucher: string
  ): Promise<number | null> {
    const validUntil = currentTime();

    const result = await this.db
      .select({
        id_plano: couponRescueItem.id_plano,
      })
      .from(couponRescueCode)
      .innerJoin(
        couponRescue,
        eq(couponRescue.id_cupom_resgatar, couponRescueCode.id_cupom_resgatar)
      )
      .innerJoin(
        couponRescueItem,
        eq(couponRescueItem.id_cupom_resgatar, couponRescue.id_cupom_resgatar)
      )
      .where(
        and(
          eq(couponRescueCode.cupom_resgatar_codigo, voucher),
          eq(couponRescueCode.status, CouponRescueCodeStatus.ACTIVE),
          eq(couponRescue.id_parceiro, partnerId),
          eq(couponRescueItem.tempo_tipo, CouponRescueItemTypeTime.MONTH),
          isNotNull(couponRescueItem.id_plano),
          gte(couponRescueItem.validade_ate, validUntil)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0].id_plano as number;
  }
}
