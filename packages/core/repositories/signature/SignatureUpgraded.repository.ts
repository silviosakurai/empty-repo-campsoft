import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { clientSignature, clientProductSignature } from "@core/models";
import { eq, sql } from "drizzle-orm";
import {
  ClientProductSignatureProcess,
  ClientSignatureRecorrencia,
  SignatureStatus,
} from "@core/common/enums/models/signature";
import { ISignatureByOrder } from "@core/interfaces/repositories/signature";

@injectable()
export class SignatureUpgradedRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async updateSignaturePrevious(
    signature: ISignatureByOrder
  ): Promise<boolean | null> {
    const result = await this.db
      .update(clientSignature)
      .set({
        id_assinatura_status: SignatureStatus.UPGRADED,
        data_assinatura_ate:
          signature.recurrence.toString() === ClientSignatureRecorrencia.YES
            ? signature.next_billing_date
            : signature.signature_date,
        data_proxima_cobranca: null,
        data_cancelamento:
          signature.recurrence.toString() === ClientSignatureRecorrencia.YES
            ? signature.next_billing_date
            : signature.signature_date,
      })
      .where(
        eq(
          clientSignature.id_assinatura_cliente,
          sql`UUID_TO_BIN(${signature.signature_id})`
        )
      )
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return true;
  }

  async updateSignatureProductsPrevious(
    signature: ISignatureByOrder
  ): Promise<boolean | null> {
    const result = await this.db
      .update(clientProductSignature)
      .set({
        processar: ClientProductSignatureProcess.YES,
        data_expiracao:
          signature.recurrence.toString() === ClientSignatureRecorrencia.YES
            ? signature.next_billing_date
            : signature.signature_date,
      })
      .where(
        eq(
          clientProductSignature.id_assinatura_cliente,
          sql`UUID_TO_BIN(${signature.signature_id})`
        )
      )
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return true;
  }
}
