import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, sql } from "drizzle-orm";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { SignatureStatus } from "@core/common/enums/models/signature";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { clientSignature } from "@core/models";

@injectable()
export class CancelSignatureRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async cancel(
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<boolean> {
    const result = await this.db
      .update(clientSignature)
      .set({
        id_assinatura_status: SignatureStatus.CANCELED,
      })
      .where(
        and(
          eq(clientSignature.id_pedido, sql`UUID_TO_BIN(${orderNumber})`),
          eq(clientSignature.id_empresa, tokenKeyData.company_id),
          eq(clientSignature.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
        )
      )
      .execute();

    return !!result[0].affectedRows;
  }
}
