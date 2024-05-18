import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { clientSignature, clientProductSignature } from "@core/models";
import { sql } from "drizzle-orm";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import {
  ClientProductSignatureProcess,
  ClientProductSignatureStatus,
  ClientSignatureRecorrencia,
  SignatureStatus,
} from "@core/common/enums/models/signature";
import { CartDocument } from "@core/interfaces/repositories/cart";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class SignatureCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(
    partnerId: number,
    tokenJwtData: ITokenJwtData,
    cart: CartDocument,
    orderId: string
  ): Promise<string | null> {
    const signatureId = uuidv4();

    const result = await this.db
      .insert(clientSignature)
      .values({
        id_assinatura_cliente: sql`UUID_TO_BIN(${signatureId})`,
        id_cliente: sql`UUID_TO_BIN(${tokenJwtData.clientId})`,
        id_pedido: sql`UUID_TO_BIN(${orderId})`,
        id_parceiro: partnerId,
        ciclo: 0,
        id_assinatura_status: SignatureStatus.PENDING,
        id_plano: cart.payload.plan.plan_id,
        recorrencia: cart.payload.subscribe
          ? ClientSignatureRecorrencia.YES
          : ClientSignatureRecorrencia.NO,
        recorrencia_periodo: cart.payload.months ?? 0,
      })
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return signatureId;
  }

  async createSignatureProducts(
    signatureId: string,
    cart: CartDocument
  ): Promise<boolean> {
    const insertProducts = cart.products_id.map((product) => {
      const productAlreadyExists = cart.signature_active.find(
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
}
