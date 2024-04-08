import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import {
  clientSignature,
  clientProductSignature,
  order,
  couponRescueCode,
  couponRescueItem,
  couponRescue,
  product,
  productType,
} from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, sql } from "drizzle-orm";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import {
  ClientProductSignatureStatus,
  ClientSignatureRecorrencia,
  SignatureStatus,
} from "@core/common/enums/models/signature";
import {
  CouponRescueItemDeleted,
  CouponRescueItemTypeTime,
} from "@core/common/enums/models/coupon";
import { Status } from "@core/common/enums/Status";
import { ProductVoucherStatus } from "@core/common/enums/models/product";
import { currentTime } from "@core/common/functions/currentTime";
import { ProductDetail } from "@core/interfaces/repositories/voucher";

@injectable()
export class AvailableVoucherProductsRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async listVoucherEligibleProductsSignatureUser(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    voucher: string
  ): Promise<ProductDetail[] | null> {
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
          WHEN ${couponRescueItem.validade_ate} IS NOT NULL AND ${couponRescueItem.validade_ate} < ${validUntil} 
            THEN ${ProductVoucherStatus.EXPIRED}
          WHEN ${clientProductSignature.id_produto} IS NOT NULL AND ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.YES} 
            THEN ${ProductVoucherStatus.IN_USE} 
          WHEN ${clientProductSignature.id_produto} IS NOT NULL AND ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.NO} 
            THEN ${ProductVoucherStatus.IN_ADDITION}
          ELSE ${ProductVoucherStatus.ACTIVE}
        END`,
        current_expiration: sql`CASE 
          WHEN ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.NO} THEN ${clientProductSignature.data_expiracao}
          ELSE null
        END`,
        expiration_date: sql`CASE 
          WHEN ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.YES} THEN 
            CASE 
              WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.MONTH} 
                THEN DATE_ADD(CURRENT_DATE(), INTERVAL ${couponRescueItem.tempo} MONTH)
              WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.DAY} 
                THEN DATE_ADD(CURRENT_DATE(), INTERVAL ${couponRescueItem.tempo} DAY)
              ELSE CURRENT_DATE()
            END
          WHEN ${clientSignature.recorrencia} = ${ClientSignatureRecorrencia.NO} THEN 
            CASE 
              WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.MONTH} 
                THEN DATE_ADD(COALESCE(${clientProductSignature.data_expiracao}, CURRENT_DATE()), INTERVAL ${couponRescueItem.tempo} MONTH)
              WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.DAY} 
                THEN DATE_ADD(COALESCE(${clientProductSignature.data_expiracao}, CURRENT_DATE()), INTERVAL ${couponRescueItem.tempo} DAY)
              ELSE 
                COALESCE(${clientProductSignature.data_expiracao}, CURRENT_DATE())
            END
          ELSE null
        END`,
        redemption_date: clientProductSignature.data_ativacao,
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
          eq(clientProductSignature.id_produto, product.id_produto),
          eq(clientProductSignature.status, ClientProductSignatureStatus.ACTIVE)
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

    if (result.length === 0) {
      return null;
    }

    return result as ProductDetail[];
  }

  async listVoucherEligibleProductsNotSignatureUser(
    tokenKeyData: ITokenKeyData,
    voucher: string
  ): Promise<ProductDetail[] | null> {
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
          WHEN ${couponRescueItem.validade_ate} IS NOT NULL AND ${couponRescueItem.validade_ate} < ${validUntil} 
            THEN ${ProductVoucherStatus.EXPIRED}
          ELSE ${ProductVoucherStatus.ACTIVE}
        END`,
        current_expiration: sql<null>`null`,
        expiration_date: sql`CASE 
          WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.MONTH} 
            THEN DATE_ADD(CURRENT_DATE(), INTERVAL ${couponRescueItem.tempo} MONTH)
          WHEN ${couponRescueItem.tempo_tipo} = ${CouponRescueItemTypeTime.DAY} 
            THEN DATE_ADD(CURRENT_DATE(), INTERVAL ${couponRescueItem.tempo} DAY)
          ELSE 
            CURRENT_DATE()
        END`,
        redemption_date: sql<null>`null`,
      })
      .from(product)
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .innerJoin(
        couponRescueItem,
        eq(product.id_produto, couponRescueItem.id_produto)
      )
      .innerJoin(
        couponRescueCode,
        eq(
          couponRescueItem.id_cupom_resgatar,
          couponRescueCode.id_cupom_resgatar
        )
      )
      .innerJoin(
        couponRescue,
        eq(couponRescue.id_cupom_resgatar, couponRescueCode.id_cupom_resgatar)
      )
      .where(
        and(
          eq(couponRescueCode.cupom_resgatar_codigo, voucher),
          eq(couponRescueItem.deleted, CouponRescueItemDeleted.NO),
          eq(product.status, Status.ACTIVE),
          eq(couponRescue.id_empresa, tokenKeyData.company_id)
        )
      )
      .groupBy(product.id_produto)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result as ProductDetail[];
  }
}
