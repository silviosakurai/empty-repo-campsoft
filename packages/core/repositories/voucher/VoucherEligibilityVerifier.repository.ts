import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { couponRescueCode, couponRescue, couponRescueItem } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, gte, inArray } from "drizzle-orm";
import { CouponRescueCodeStatus } from "@core/common/enums/models/voucher";
import { IVerifyEligibilityUser } from "@core/interfaces/repositories/voucher";
import { currentTime } from "@core/common/functions/currentTime";
import { CouponRescueStatus } from "@core/common/enums/models/coupon";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class VoucherEligibilityVerifierRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async verifyEligibilityUser(
    tokenKeyData: ITokenKeyData,
    voucher: string
  ): Promise<IVerifyEligibilityUser | null> {
    const validUntil = currentTime();

    const result = await this.db
      .select({
        cupom_resgatar_codigo: couponRescueCode.cupom_resgatar_codigo,
        qnt_uso_por_cli: couponRescueCode.qnt_uso_por_cli,
      })
      .from(couponRescueCode)
      .innerJoin(
        couponRescue,
        eq(couponRescue.id_cupom_resgatar, couponRescueCode.id_cupom_resgatar)
      )
      .where(
        and(
          eq(couponRescueCode.cupom_resgatar_codigo, voucher),
          eq(couponRescueCode.status, CouponRescueCodeStatus.ACTIVE),
          gte(couponRescueCode.qnt_uso_faltante, 1),
          eq(couponRescue.status, CouponRescueStatus.ACTIVE),
          eq(couponRescue.id_parceiro, tokenKeyData.id_parceiro),
          gte(couponRescue.validade, validUntil)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as IVerifyEligibilityUser;
  }

  isProductsVoucherEligible = async (
    tokenKeyData: ITokenKeyData,
    voucher: string | null | undefined,
    selectedProducts: string[] | null
  ) => {
    if (!voucher) {
      return false;
    }

    if (!selectedProducts?.length) {
      return true;
    }

    const result = await this.db
      .select({
        product_id: couponRescueItem.id_produto,
      })
      .from(couponRescueItem)
      .innerJoin(
        couponRescueCode,
        eq(
          couponRescueCode.id_cupom_resgatar,
          couponRescueItem.id_cupom_resgatar
        )
      )
      .innerJoin(
        couponRescue,
        eq(couponRescue.id_cupom_resgatar, couponRescueItem.id_cupom_resgatar)
      )
      .where(
        and(
          eq(couponRescueCode.cupom_resgatar_codigo, voucher),
          eq(couponRescueCode.status, CouponRescueCodeStatus.ACTIVE),
          gte(couponRescueCode.qnt_uso_faltante, 1),
          eq(couponRescue.status, CouponRescueStatus.ACTIVE),
          eq(couponRescue.id_parceiro, tokenKeyData.id_parceiro),
          inArray(couponRescueItem.id_produto, selectedProducts)
        )
      )
      .execute();

    return result.length > 0;
  };
}
