import { and, eq, gte, inArray, or, sql } from "drizzle-orm";
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
    couponCode: string,
    planId: number,
    selectedProducts: string[] | null
  ): Promise<ICouponVerifyEligibilityUser[]> {
    const validUntil = currentTime();

    let wherePlansOrProducts = or(eq(couponCartValidItems.id_plano, planId));

    if (selectedProducts) {
      wherePlansOrProducts = or(
        eq(couponCartValidItems.id_plano, planId),
        inArray(couponCartValidItems.id_produto, selectedProducts)
      );
    }

    const result = await this.db
      .select({
        cupom_carrinho_codigo: couponCartCode.cupom_carrinho_codigo,
        qnt_uso_por_cli: couponCartCode.qnt_uso_por_cli,
        desconto_percentual: couponCartCode.desconto_percentual,
        id_produto: couponCartValidItems.id_produto,
        id_plano: couponCartValidItems.id_plano,
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
          eq(couponCart.id_parceiro, tokenKeyData.company_id),
          gte(couponCartCode.qnt_uso_faltante, 1),
          gte(couponCart.validade, validUntil),
          or(wherePlansOrProducts)
        )
      )
      .execute();

    if (!result.length) {
      return [] as ICouponVerifyEligibilityUser[];
    }

    return result as ICouponVerifyEligibilityUser[];
  }

  async verifyRedemptionCouponByUser(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    isEligibility: ICouponVerifyEligibilityUser[],
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
          eq(clientSignature.id_parceiro, tokenKeyData.company_id)
        )
      )
      .execute();

    if (!result.length) {
      return false;
    }

    if (result[0].total > isEligibility[0].qnt_uso_por_cli) {
      return false;
    }

    return true;
  }
}
