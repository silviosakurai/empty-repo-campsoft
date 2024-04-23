import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { clientSignature, clientProductSignature } from "@core/models";
import { and, desc, eq, sql } from "drizzle-orm";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import {
  ClientProductSignatureProcess,
  ClientProductSignatureStatus,
  ClientSignatureRecorrencia,
  SignatureStatus,
} from "@core/common/enums/models/signature";
import { ISignatureActiveByClient } from "@core/interfaces/repositories/signature";

@injectable()
export class SignatureCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    orderId: string
  ): Promise<{ id_assinatura_cliente: string } | null> {
    const result = await this.db
      .insert(clientSignature)
      .values({
        id_cliente: sql`UUID_TO_BIN(${tokenJwtData.clientId})`,
        id_pedido: sql`UUID_TO_BIN(${orderId})`,
        id_parceiro: tokenKeyData.company_id,
        ciclo: 0,
        id_assinatura_status: SignatureStatus.PENDING,
        id_plano: payload.plan.plan_id,
        recorrencia: payload.subscribe
          ? ClientSignatureRecorrencia.YES
          : ClientSignatureRecorrencia.NO,
        recorrencia_periodo: payload.months ?? 0,
      })
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    const signatureFounded = await this.findLastSignatureByIdClient(
      tokenJwtData.clientId,
      tokenKeyData.company_id,
      orderId
    );

    if (!signatureFounded) {
      return null;
    }

    return {
      id_assinatura_cliente: signatureFounded.id_assinatura_cliente,
    } as { id_assinatura_cliente: string };
  }

  async createSignatureProducts(
    products: string[],
    signatureId: string,
    findSignatureActiveByClientId: ISignatureActiveByClient[]
  ): Promise<boolean> {
    const insertProducts = products.map((product) => {
      const productAlreadyExists = findSignatureActiveByClientId.find(
        (signature) => signature.product_id === product
      );

      return {
        id_assinatura_cliente: sql`UUID_TO_BIN(${signatureId})`,
        id_produto: product,
        processar: ClientProductSignatureProcess.NO,
        status: ClientProductSignatureStatus.INACTIVE,
        data_expiracao:
          productAlreadyExists?.recurrence === ClientSignatureRecorrencia.YES
            ? null
            : productAlreadyExists?.expiration_date,
      };
    });

    const result = await this.db
      .insert(clientProductSignature)
      .values(insertProducts)
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }

  async findLastSignatureByIdClient(
    clientId: string,
    companyId: number,
    orderId: string
  ): Promise<{ id_assinatura_cliente: string } | null> {
    const result = await this.db
      .select({
        id_assinatura_cliente: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
      })
      .from(clientSignature)
      .where(
        and(
          eq(clientSignature.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(clientSignature.id_pedido, sql`UUID_TO_BIN(${orderId})`),
          eq(clientSignature.id_parceiro, companyId)
        )
      )
      .orderBy(desc(clientSignature.created_at))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as { id_assinatura_cliente: string };
  }
}
