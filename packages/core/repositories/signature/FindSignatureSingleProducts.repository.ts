import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import {
  clientProductSignature,
  clientSignature,
  plan,
  planItem,
  productCrossSell,
  product,
} from "@core/models";
import { and, eq, ne, sql } from "drizzle-orm";
import { ProductSingleView } from "@core/interfaces/repositories/signature";

@injectable()
export class FindSignatureSingleProductsRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async find(
    planId: number | null,
    partnerId: number,
    clientId: string
  ): Promise<ProductSingleView[]> {
    if (!planId) {
      return [] as ProductSingleView[];
    }

    const response = await this.db
      .select({
        product_id: clientProductSignature.id_produto,
        name: product.produto,
        slug: product.url_caminho,
        status: clientProductSignature.status,
        activation_date: clientProductSignature.data_ativacao,
        price: productCrossSell.preco_desconto,
        months: productCrossSell.meses,
        months_description: sql<string>`CASE ${clientSignature.recorrencia_periodo}
            WHEN 1 THEN 'Mensal'
            WHEN 2 THEN 'Bimestral'
            WHEN 3 THEN 'Trimestral'
            WHEN 6 THEN 'Semestral'
            WHEN 12 THEN 'Anual' 
            ELSE CONCAT(${clientSignature.recorrencia_periodo}, ' meses')
          END`,
        images: {
          main_image: product.imagem,
          icon: product.icon,
          logo: product.logo,
          background_image: product.imagem_background,
        },
      })
      .from(clientSignature)
      .innerJoin(
        clientProductSignature,
        eq(
          clientProductSignature.id_assinatura_cliente,
          clientSignature.id_assinatura_cliente
        )
      )
      .innerJoin(plan, eq(plan.id_plano, clientSignature.id_plano))
      .innerJoin(
        planItem,
        and(
          eq(planItem.id_plano, plan.id_plano),
          ne(planItem.id_produto, clientProductSignature.id_produto)
        )
      )
      .innerJoin(
        productCrossSell,
        and(
          eq(productCrossSell.id_plano, plan.id_plano),
          eq(productCrossSell.id_produto, clientProductSignature.id_produto),
          eq(productCrossSell.meses, clientSignature.recorrencia_periodo)
        )
      )
      .innerJoin(product, eq(product.id_produto, productCrossSell.id_produto))
      .where(
        and(
          eq(clientSignature.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(clientSignature.id_parceiro, partnerId),
          eq(clientSignature.id_plano, planId)
        )
      )
      .groupBy(clientProductSignature.id_produto)
      .execute();

    if (response.length === 0) {
      return [];
    }

    return response as ProductSingleView[];
  }
}
