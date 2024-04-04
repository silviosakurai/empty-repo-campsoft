import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, inArray, sql } from "drizzle-orm";
import { ClientProductSignatureStatus } from "@core/common/enums/models/signature";
import { clientProductSignature } from "@core/models";

@injectable()
export class CancelProductSignatureRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async cancel(
    signatureId: string,
    productCancelDate: string,
    productIds: string[]
  ): Promise<boolean> {
    const result = await this.db
      .update(clientProductSignature)
      .set({
        status: ClientProductSignatureStatus.INACTIVE,
        data_expiracao: productCancelDate,
      })
      .where(
        and(
          eq(
            clientProductSignature.id_assinatura_cliente,
            sql`UUID_TO_BIN(${signatureId})`
          ),
          inArray(clientProductSignature.id_produto, productIds)
        )
      )
      .execute();

    return !!result[0].affectedRows;
  }
}
