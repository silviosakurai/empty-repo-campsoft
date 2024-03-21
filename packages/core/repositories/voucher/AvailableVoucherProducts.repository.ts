import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import {
  clientSignature,
  clientProductSignature,
  order,
  couponRescueCode,
  couponRescueItem,
  product,
  productType,
} from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, sql } from "drizzle-orm";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import {
  ClientSignatureRecorrencia,
  SignatureStatus,
} from "@core/common/enums/models/signature";
import { CouponRescueItemDeleted } from "@core/common/enums/models/coupon";
import { Status } from "@core/common/enums/Status";
import { ProductVoucherStatus } from "@core/common/enums/models/product";
import { currentTime } from "@core/common/functions/currentTime";

@injectable()
export class AvailableVoucherProductsRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async listVoucherEligibleProductsUser(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string
  ) {
    const validUntil = currentTime();

    const result = await this.db
      .select({
        product_id: product.id_produto,
        name: product.produto,
        long_description: product.descricao,
        short_description: product.descricao_curta,
        marketing_phrases: product.frases_marketing,
        content_provider_name: product.conteudista_nome,
        slug: product.url_caminho,
        images: {
          main_image: product.imagem,
          icon: product.icon,
          logo: product.logo,
          background_image: product.imagem_background,
        },
        product_type: {
          product_type_id: productType.id_produto_tipo,
          product_type_name: productType.produto_tipo,
        },
        status: sql`CASE 
          WHEN ${couponRescueItem.validade_ate} IS NOT NULL AND ${couponRescueItem.validade_ate} < ${validUntil} THEN ${ProductVoucherStatus.EXPIRED}
          WHEN ${clientProductSignature.id_produto} IS NOT NULL AND ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.YES} THEN ${ProductVoucherStatus.IN_USE} 
          WHEN ${clientProductSignature.id_produto} IS NOT NULL AND ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.NO} THEN ${ProductVoucherStatus.IN_ADDITION}
          ELSE ${ProductVoucherStatus.ACTIVE}
        END`,
        current_expiration: sql`CASE 
          WHEN ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.NO} THEN ${clientSignature.data_assinatura_ate}
          ELSE null
        END`,
        expiration_date: couponRescueItem.validade_ate,
      })
      .from(clientSignature)
      .innerJoin(order, eq(clientSignature.id_pedido, order.id_pedido))
      .innerJoin(
        couponRescueCode,
        eq(order.cupom_resgatar_codigo, couponRescueCode.cupom_resgatar_codigo)
      )
      .innerJoin(
        couponRescueItem,
        eq(
          couponRescueCode.id_cupom_resgatar,
          couponRescueItem.id_cupom_resgatar
        )
      )
      .innerJoin(product, eq(couponRescueItem.id_produto, product.id_produto))
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .leftJoin(
        clientProductSignature,
        and(
          eq(
            clientSignature.id_assinatura_cliente,
            clientProductSignature.id_assinatura_cliente
          ),
          eq(clientProductSignature.id_produto, product.id_produto)
        )
      )
      .where(
        and(
          eq(
            clientSignature.id_cliente,
            sql`UUID_TO_BIN(${tokenJwtData.clientId})`
          ),
          eq(clientSignature.id_assinatura_status, SignatureStatus.ACTIVE),
          eq(order.cupom_resgatar_codigo, voucher),
          eq(clientSignature.id_empresa, tokenKeyData.company_id),
          eq(couponRescueItem.deleted, CouponRescueItemDeleted.NO),
          eq(product.status, Status.ACTIVE)
        )
      )
      .groupBy(product.id_produto)
      .execute();

    return result;
  }
}
