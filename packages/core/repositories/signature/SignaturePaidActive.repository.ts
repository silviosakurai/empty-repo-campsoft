import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { clientSignature, clientProductSignature } from "@core/models";
import {
  and,
  eq,
  SQL,
  sql,
  notInArray,
  isNotNull,
  inArray,
  ne,
  count,
} from "drizzle-orm";
import {
  ClientProductSignatureProcess,
  ClientProductSignatureStatus,
  ClientSignatureRecorrencia,
  SignatureStatus,
} from "@core/common/enums/models/signature";
import { currentTime } from "@core/common/functions/currentTime";
import { addMonthsToCurrentDate } from "@core/common/functions/addMonthsToCurrentDate";
import {
  ISelectSignatureProductsActive,
  ISignatureByOrder,
  IUpdateAndSelectProductExpirationDates,
} from "@core/interfaces/repositories/signature";
import { IVoucherProductsAndPlans } from "@core/interfaces/repositories/voucher";

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
        ciclo: signature.cycle + 1,
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

    await this.updateSignaturePlanOld(signature, validUntil);

    return true;
  }

  private async updateAndSelectProductExpirationDates(
    signature: ISignatureByOrder,
    validUntil: string
  ): Promise<IUpdateAndSelectProductExpirationDates[]> {
    const result = await this.db
      .select({
        signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
        product_id: clientProductSignature.id_produto,
        expiration_date: clientProductSignature.data_expiracao,
      })
      .from(clientProductSignature)
      .innerJoin(
        clientSignature,
        eq(
          clientSignature.id_assinatura_cliente,
          clientProductSignature.id_assinatura_cliente
        )
      )
      .where(
        and(
          eq(
            clientProductSignature.id_assinatura_cliente,
            sql`UUID_TO_BIN(${signature.signature_id})`
          ),
          isNotNull(clientProductSignature.data_expiracao)
        )
      )
      .execute();

    if (result.length === 0) {
      return [] as IUpdateAndSelectProductExpirationDates[];
    }

    for (const product of result) {
      const newExpirationDate = addMonthsToCurrentDate(
        product.expiration_date ?? validUntil,
        signature.recurrence_period
      );

      await this.db
        .update(clientProductSignature)
        .set({
          processar: ClientProductSignatureProcess.YES,
          status: ClientProductSignatureStatus.ACTIVE,
          data_agendamento: validUntil,
          data_expiracao:
            signature.recurrence.toString() === ClientSignatureRecorrencia.YES
              ? null
              : newExpirationDate,
        })
        .where(
          and(
            eq(
              clientProductSignature.id_assinatura_cliente,
              sql`UUID_TO_BIN(${signature.signature_id})`
            ),
            eq(clientProductSignature.id_produto, product.product_id)
          )
        )
        .execute();
    }

    return result as IUpdateAndSelectProductExpirationDates[];
  }

  private async selectSignatureProductsActive(
    signature: ISignatureByOrder,
    products: IUpdateAndSelectProductExpirationDates[]
  ): Promise<ISelectSignatureProductsActive[]> {
    const productsId = products.map((product) => product.product_id);
    const signaturesIdIgnore = products.map(
      (product) =>
        sql`UUID_TO_BIN(${product.signature_id})` as unknown as string
    );

    const result = await this.db
      .select({
        signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
        product_id: clientProductSignature.id_produto,
      })
      .from(clientProductSignature)
      .innerJoin(
        clientSignature,
        eq(
          clientSignature.id_assinatura_cliente,
          clientProductSignature.id_assinatura_cliente
        )
      )
      .where(
        and(
          eq(
            clientSignature.id_cliente,
            sql`UUID_TO_BIN(${signature.client_id})`
          ),
          inArray(clientProductSignature.id_produto, productsId),
          notInArray(
            clientProductSignature.id_assinatura_cliente,
            signaturesIdIgnore
          )
        )
      )
      .execute();

    if (result.length === 0) {
      return [] as ISelectSignatureProductsActive[];
    }

    return result as ISelectSignatureProductsActive[];
  }

  private async updateSignatureProductsActive(
    signature: ISignatureByOrder,
    products: IUpdateAndSelectProductExpirationDates[]
  ): Promise<boolean> {
    const validUntil = currentTime();

    const selectSignatureProductsActive =
      await this.selectSignatureProductsActive(signature, products);

    if (selectSignatureProductsActive.length === 0) {
      return false;
    }

    const productsId = selectSignatureProductsActive.map(
      (product) => product.product_id
    );
    const signaturesId = selectSignatureProductsActive.map(
      (product) =>
        sql`UUID_TO_BIN(${product.signature_id})` as unknown as string
    );

    const update = await this.db
      .update(clientProductSignature)
      .set({
        processar: ClientProductSignatureProcess.YES,
        status: ClientProductSignatureStatus.INACTIVE,
        data_ativacao: null,
        data_agendamento: null,
        data_expiracao: validUntil,
      })
      .where(
        and(
          inArray(clientProductSignature.id_produto, productsId),
          inArray(clientProductSignature.id_assinatura_cliente, signaturesId)
        )
      )
      .execute();

    return update[0].affectedRows > 0;
  }

  private async applyFilterUpdateSignatureProductsPaid(
    signature: ISignatureByOrder,
    validUntil: string
  ): Promise<SQL<unknown> | undefined> {
    let whereUpdate = and(
      eq(
        clientProductSignature.id_assinatura_cliente,
        sql`UUID_TO_BIN(${signature.signature_id})`
      )
    );

    const updateAndSelectProductExpirationDates =
      await this.updateAndSelectProductExpirationDates(signature, validUntil);

    if (updateAndSelectProductExpirationDates.length > 0) {
      const productsIgnore = updateAndSelectProductExpirationDates.map(
        (product) => product.product_id
      );

      if (productsIgnore.length > 0) {
        whereUpdate = and(
          eq(
            clientProductSignature.id_assinatura_cliente,
            sql`UUID_TO_BIN(${signature.signature_id})`
          ),
          notInArray(clientProductSignature.id_produto, productsIgnore)
        );
      }

      await this.updateSignatureProductsActive(
        signature,
        updateAndSelectProductExpirationDates
      );
    }

    return whereUpdate;
  }

  async updateSignaturePlanOld(
    signature: ISignatureByOrder,
    validUntil: string
  ): Promise<boolean> {
    const result = await this.db
      .update(clientSignature)
      .set({
        id_assinatura_status: SignatureStatus.UPGRADED,
        data_assinatura_ate: null,
        data_proxima_cobranca: null,
        data_cancelamento: validUntil,
      })
      .where(
        and(
          eq(clientSignature.id_plano, signature.plan_id),
          eq(clientSignature.id_assinatura_status, SignatureStatus.ACTIVE),
          eq(
            clientSignature.id_cliente,
            sql`UUID_TO_BIN(${signature.client_id})`
          ),
          ne(
            clientSignature.id_assinatura_cliente,
            sql`UUID_TO_BIN(${signature.signature_id})`
          )
        )
      )
      .execute();

    return result[0].affectedRows > 0;
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

    const whereUpdate = await this.applyFilterUpdateSignatureProductsPaid(
      signature,
      validUntil
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
      .where(whereUpdate)
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

  async updateSignaturePaidWithVoucher(
    signature: ISignatureByOrder,
    voucherProductsAndPlans: IVoucherProductsAndPlans
  ) {
    const validUntil = currentTime();

    const result = await this.db
      .update(clientSignature)
      .set({
        id_assinatura_status: SignatureStatus.ACTIVE,
        recorrencia: ClientSignatureRecorrencia.NO,
        ciclo: signature.cycle + 1,
        data_inicio: validUntil,
        data_assinatura_ate:
          voucherProductsAndPlans.plan?.expiration_date ?? null,
        data_proxima_cobranca: null,
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

  async updateSignatureProductsPaidWithVoucher(
    signature: ISignatureByOrder,
    voucherProductsAndPlans: IVoucherProductsAndPlans
  ): Promise<boolean | null> {
    const validUntil = currentTime();

    const whereUpdate = await this.applyFilterUpdateSignatureProductsPaid(
      signature,
      validUntil
    );

    const result = await this.db
      .update(clientProductSignature)
      .set({
        processar: ClientProductSignatureProcess.YES,
        status: ClientProductSignatureStatus.ACTIVE,
        data_ativacao: null,
        data_agendamento: validUntil,
        data_expiracao: voucherProductsAndPlans.plan?.expiration_date,
      })
      .where(whereUpdate)
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return true;
  }

  private async isExistProductSignature(
    signature: ISignatureByOrder,
    productId: string
  ): Promise<boolean> {
    const result = await this.db
      .select({
        total: count(),
      })
      .from(clientProductSignature)
      .innerJoin(
        clientSignature,
        eq(
          clientSignature.id_assinatura_cliente,
          clientProductSignature.id_assinatura_cliente
        )
      )
      .where(
        and(
          eq(
            clientSignature.id_cliente,
            sql`UUID_TO_BIN(${signature.client_id})`
          ),
          eq(
            clientProductSignature.id_assinatura_cliente,
            sql`UUID_TO_BIN(${signature.signature_id})`
          ),
          eq(clientProductSignature.id_produto, productId)
        )
      )
      .execute();

    if (!result?.length) {
      return false;
    }

    return result[0].total > 0;
  }

  private async existProductSignatureOld(
    signature: ISignatureByOrder,
    productId: string
  ): Promise<ISelectSignatureProductsActive[]> {
    const result = await this.db
      .select({
        signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
        product_id: clientProductSignature.id_produto,
      })
      .from(clientProductSignature)
      .innerJoin(
        clientSignature,
        eq(
          clientSignature.id_assinatura_cliente,
          clientProductSignature.id_assinatura_cliente
        )
      )
      .where(
        and(
          eq(
            clientSignature.id_cliente,
            sql`UUID_TO_BIN(${signature.client_id})`
          ),
          eq(
            clientProductSignature.status,
            ClientProductSignatureStatus.ACTIVE
          ),
          ne(
            clientProductSignature.id_assinatura_cliente,
            sql`UUID_TO_BIN(${signature.signature_id})`
          ),
          eq(clientProductSignature.id_produto, productId)
        )
      )
      .execute();

    if (result.length === 0) {
      return [] as ISelectSignatureProductsActive[];
    }

    return result as ISelectSignatureProductsActive[];
  }

  private async existProductSignatureCanceledOld(
    existProductSignatureOld: ISelectSignatureProductsActive[]
  ): Promise<void> {
    const validUntil = currentTime();

    for (const product of existProductSignatureOld) {
      await this.db
        .update(clientProductSignature)
        .set({
          processar: ClientProductSignatureProcess.YES,
          status: ClientProductSignatureStatus.INACTIVE,
          data_ativacao: null,
          data_agendamento: null,
          data_expiracao: validUntil,
        })
        .where(
          and(
            eq(clientProductSignature.id_produto, product.product_id),
            eq(
              clientProductSignature.id_assinatura_cliente,
              sql`UUID_TO_BIN(${product.signature_id})`
            )
          )
        )
        .execute();
    }
  }

  async updateOrCreateSignatureProductsPaidWithVoucher(
    signature: ISignatureByOrder,
    voucherProductsAndPlans: IVoucherProductsAndPlans
  ): Promise<void> {
    const validUntil = currentTime();

    voucherProductsAndPlans.products?.forEach(async (product) => {
      const existProductSignature = await this.isExistProductSignature(
        signature,
        product.product_id
      );

      if (!existProductSignature) {
        const existProductSignatureOld = await this.existProductSignatureOld(
          signature,
          product.product_id
        );

        if (existProductSignatureOld) {
          await this.existProductSignatureCanceledOld(existProductSignatureOld);
        }

        await this.db
          .insert(clientProductSignature)
          .values({
            id_assinatura_cliente: sql`UUID_TO_BIN(${signature.signature_id})`,
            id_produto: product.product_id,
            processar: ClientProductSignatureProcess.YES,
            status: ClientProductSignatureStatus.ACTIVE,
            data_agendamento: validUntil,
            data_expiracao: product.expiration_date,
          })
          .execute();
      }
    });
  }
}
