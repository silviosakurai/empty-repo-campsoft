import { and, eq, gte, sql } from "drizzle-orm";
import * as schema from "@core/models";
import {
  clientSignature,
  couponCart,
  couponCartCode,
  couponCartValidItems,
  order,
} from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ICouponVerifyEligibilityUser } from "@core/interfaces/repositories/coupon";
import { currentTime } from "@core/common/functions/currentTime";
import { CouponRescueStatus } from "@core/common/enums/models/coupon";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { SignatureStatus } from "@core/common/enums/models/signature";

@injectable()
export class CouponListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async verifyEligibilityCoupon(
    tokenKeyData: ITokenKeyData,
    couponCode: string
  ): Promise<ICouponVerifyEligibilityUser | null> {
    const validUntil = currentTime();

    const result = await this.db
      .select({
        cupom_carrinho_codigo: couponCartCode.cupom_carrinho_codigo,
        qnt_uso_por_cli: couponCartCode.qnt_uso_por_cli,
        desconto_percentual: couponCartCode.desconto_percentual,
      })
      .from(couponCartCode)
      .innerJoin(
        couponCart,
        eq(couponCart.id_cupom_carrinho, couponCartCode.id_cupom_carrinho)
      )
      .innerJoin(
        couponCartValidItems,
        eq(couponCart.id_cupom_carrinho, couponCartValidItems.id_cupom_carrinho)
      )
      .where(
        and(
          eq(couponCartCode.cupom_carrinho_codigo, couponCode),
          eq(couponCart.status, CouponRescueStatus.ACTIVE),
          eq(couponCart.id_empresa, tokenKeyData.company_id),
          gte(couponCartCode.qnt_uso_faltante, 1),
          gte(couponCart.validade, validUntil)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as ICouponVerifyEligibilityUser;
  }

  async verifyRedemptionCouponByUser(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    isEligibility: ICouponVerifyEligibilityUser,
    couponCode: string
  ): Promise<boolean> {
    const result = await this.db
      .select({
        total: sql`count(${clientSignature.id_assinatura_cliente})`.mapWith(
          Number
        ),
      })
      .from(clientSignature)
      .innerJoin(order, eq(clientSignature.id_pedido, order.id_pedido))
      .where(
        and(
          eq(
            clientSignature.id_cliente,
            sql`UUID_TO_BIN(${tokenJwtData.clientId})`
          ),
          eq(clientSignature.id_assinatura_status, SignatureStatus.ACTIVE),
          eq(order.cupom_carrinho_codigo, couponCode),
          eq(clientSignature.id_empresa, tokenKeyData.company_id)
        )
      )
      .execute();

    if (!result.length) {
      return false;
    }

    if (result[0].total > isEligibility.qnt_uso_por_cli) {
      return false;
    }

    return true;
  }
}
