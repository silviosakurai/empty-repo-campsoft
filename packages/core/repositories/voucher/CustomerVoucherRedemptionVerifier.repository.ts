import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { clientSignature, order } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, sql } from "drizzle-orm";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { IVerifyEligibilityUser } from "@core/interfaces/repositories/voucher";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class CustomerVoucherRedemptionVerifierRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async verifyRedemptionUser(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    isEligibility: IVerifyEligibilityUser,
    voucher: string
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
          eq(order.cupom_resgatar_codigo, voucher),
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
