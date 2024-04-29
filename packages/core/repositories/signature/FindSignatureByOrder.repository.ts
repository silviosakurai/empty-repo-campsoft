import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import {
  signatureStatus,
  clientProductSignature,
  clientSignature,
  planItem,
} from "@core/models";
import { and, count, eq, inArray, ne, sql } from "drizzle-orm";
import {
  ISignatureActiveByClient,
  ISignatureByOrder,
  ISignatureFindByClientId,
  ISignatureFindByOrder,
} from "@core/interfaces/repositories/signature";
import { OrderRecorrencia } from "@core/common/enums/models/order";
import {
  ClientProductSignatureStatus,
  ClientSignatureRecorrencia,
  SignatureStatus,
} from "@core/common/enums/models/signature";

@injectable()
export class FindSignatureByOrderNumber {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async find(orderNumber: string): Promise<ISignatureFindByOrder[] | null> {
    const response = await this.db
      .select({
        signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
        product_id: clientProductSignature.id_produto,
        product_cancel_date: sql`CASE 
          WHEN ${clientSignature.recorrencia} = ${OrderRecorrencia.YES} 
            THEN DATE_SUB(${clientSignature.data_proxima_cobranca}, INTERVAL 1 DAY)
          ELSE DATE_SUB(${clientSignature.data_assinatura_ate}, INTERVAL 1 DAY)
        END`,
      })
      .from(clientSignature)
      .innerJoin(
        clientProductSignature,
        eq(
          clientSignature.id_assinatura_cliente,
          clientProductSignature.id_assinatura_cliente
        )
      )
      .innerJoin(
        signatureStatus,
        eq(
          clientSignature.id_assinatura_status,
          signatureStatus.id_assinatura_status
        )
      )
      .where(
        and(
          eq(clientSignature.id_pedido, sql`UUID_TO_BIN(${orderNumber})`),
          eq(signatureStatus.assinatura_status, "ativo")
        )
      );

    if (response.length === 0) {
      return null;
    }

    return response as ISignatureFindByOrder[];
  }

  async findByOrder(orderNumber: string): Promise<ISignatureByOrder | null> {
    const response = await this.db
      .select({
        signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
        client_id: sql`BIN_TO_UUID(${clientSignature.id_cliente})`,
        plan_id: clientSignature.id_plano,
        recurrence: clientSignature.recorrencia,
        recurrence_period: clientSignature.recorrencia_periodo,
        cycle: clientSignature.ciclo,
        start_date: clientSignature.data_inicio,
        signature_date: clientSignature.data_assinatura_ate,
        next_billing_date: clientSignature.data_proxima_cobranca,
      })
      .from(clientSignature)
      .where(
        and(eq(clientSignature.id_pedido, sql`UUID_TO_BIN(${orderNumber})`))
      );

    if (response.length === 0) {
      return null;
    }

    return response[0] as unknown as ISignatureByOrder;
  }

  async findSignatureActiveByClientId(
    clientId: string,
    planId: number,
    productsIds: string[]
  ): Promise<ISignatureActiveByClient[]> {
    const response = await this.db
      .select({
        product_id: clientProductSignature.id_produto,
        discount_percentage: sql`IFNULL(${planItem.percentual_do_plano}, 0)`,
        recurrence: clientSignature.recorrencia,
        expiration_date: clientProductSignature.data_expiracao,
      })
      .from(clientSignature)
      .innerJoin(
        clientProductSignature,
        eq(
          clientProductSignature.id_assinatura_cliente,
          clientSignature.id_assinatura_cliente
        )
      )
      .innerJoin(
        planItem,
        and(
          eq(planItem.id_plano, planId),
          eq(planItem.id_produto, clientProductSignature.id_produto)
        )
      )
      .where(
        and(
          eq(clientSignature.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(clientSignature.id_assinatura_status, SignatureStatus.ACTIVE),
          eq(
            clientProductSignature.status,
            ClientProductSignatureStatus.ACTIVE
          ),
          inArray(clientProductSignature.id_produto, productsIds)
        )
      );

    if (response.length === 0) {
      return [] as ISignatureActiveByClient[];
    }

    return response as ISignatureActiveByClient[];
  }

  async isSignaturePlanActiveByClientId(
    clientId: string,
    planId: number
  ): Promise<boolean> {
    const response = await this.db
      .select({
        total: count(),
      })
      .from(clientSignature)
      .where(
        and(
          eq(clientSignature.id_assinatura_status, SignatureStatus.ACTIVE),
          eq(clientSignature.recorrencia, ClientSignatureRecorrencia.YES),
          eq(clientSignature.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(clientSignature.id_plano, planId)
        )
      );

    if (!response?.length) {
      return false;
    }

    return response[0].total > 0;
  }

  async findProductsBySignatureNotPlan(
    clientId: string,
    signatureId: string,
    planId: number
  ): Promise<ISignatureFindByClientId[]> {
    const response = await this.db
      .select({
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
      .leftJoin(
        planItem,
        and(
          eq(planItem.id_plano, clientSignature.id_plano),
          ne(planItem.id_produto, clientProductSignature.id_produto)
        )
      )
      .where(
        and(
          eq(
            clientSignature.id_assinatura_cliente,
            sql`UUID_TO_BIN(${signatureId})`
          ),
          eq(clientSignature.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(clientSignature.id_assinatura_status, SignatureStatus.ACTIVE),
          eq(clientSignature.id_plano, planId)
        )
      );

    if (response.length === 0) {
      return [] as ISignatureFindByClientId[];
    }

    return response as ISignatureFindByClientId[];
  }
}
