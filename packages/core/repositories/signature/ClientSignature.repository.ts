import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { clientSignature } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, sql } from "drizzle-orm";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { SignatureStatus } from "@core/common/enums/models/signature";

@injectable()
export class ClientSignatureRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async isClientSignatureActive(tokenJwtData: ITokenJwtData): Promise<boolean> {
    const result = await this.db
      .select({
        id: clientSignature.id_assinatura_cliente,
      })
      .from(clientSignature)
      .where(
        and(
          eq(
            clientSignature.id_cliente,
            sql`UUID_TO_BIN(${tokenJwtData.clientId})`
          ),
          eq(clientSignature.id_assinatura_status, SignatureStatus.ACTIVE)
        )
      )
      .execute();

    return result.length > 0;
  }
}
