import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { clientSignature, clientProductSignature } from "@core/models";
import { eq, sql } from "drizzle-orm";
import {
  ClientProductSignatureProcess,
  ClientProductSignatureStatus,
  ClientSignatureRecorrencia,
  SignatureStatus,
} from "@core/common/enums/models/signature";
import { currentTime } from "@core/common/functions/currentTime";
import { addMonthsToCurrentDate } from "@core/common/functions/addMonthsToCurrentDate";
import { ISignatureByOrder } from "@core/interfaces/repositories/signature";

@injectable()
export class SignaturePaidActiveRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async updateSignaturePaid(
    signature: ISignatureByOrder,
    previousSignature: ISignatureByOrder | null
  ): Promise<boolean | null> {
    const validUntil = this.validUntilDate(previousSignature);
    const signatureDate = addMonthsToCurrentDate(
      validUntil,
      signature.recurrence_period
    );

    const result = await this.db
      .update(clientSignature)
      .set({
        id_assinatura_status: SignatureStatus.ACTIVE,
        data_inicio: validUntil,
        data_assinatura_ate:
          signature.recurrence.toString() === ClientSignatureRecorrencia.YES
            ? null
            : signatureDate,
        data_proxima_cobranca:
          signature.recurrence.toString() === ClientSignatureRecorrencia.YES
            ? signatureDate
            : null,
        data_ultimo_pagamento: validUntil,
        data_cancelamento: null,
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

  async updateSignatureProductsPaid(
    signature: ISignatureByOrder,
    previousSignature: ISignatureByOrder | null
  ): Promise<boolean | null> {
    const validUntil = this.validUntilDate(previousSignature);
    const signatureDate = addMonthsToCurrentDate(
      validUntil,
      signature.recurrence_period
    );

    const result = await this.db
      .update(clientProductSignature)
      .set({
        processar: ClientProductSignatureProcess.YES,
        status: ClientProductSignatureStatus.ACTIVE,
        data_ativacao: null,
        data_agendamento: validUntil,
        data_expiracao:
          signature.recurrence.toString() === ClientSignatureRecorrencia.YES
            ? null
            : signatureDate,
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

  private validUntilDate(previousSignature: ISignatureByOrder | null): string {
    let validUntil = currentTime();

    if (previousSignature) {
      validUntil =
        previousSignature.recurrence.toString() ===
        ClientSignatureRecorrencia.YES
          ? previousSignature.next_billing_date
          : previousSignature.signature_date;
    }

    return validUntil;
  }
}
