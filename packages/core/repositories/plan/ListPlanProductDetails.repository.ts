import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { plan, product, productType, planItem } from "@core/models";
import { and, eq } from "drizzle-orm";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { PlanProducts } from "@core/interfaces/repositories/voucher";

@injectable()
export class ListPlanProductDetailsRepository {
  constructor(@inject("Database") private db: MySql2Database<typeof schema>) {}

  async list(
    planId: number,
    tokenKeyData: ITokenKeyData
  ): Promise<PlanProducts[]> {
    const result = await this.db
      .select({
        product_id: planItem.id_produto,
        status: product.status,
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
      })
      .from(plan)
      .innerJoin(planItem, eq(plan.id_plano, planItem.id_plano))
      .innerJoin(product, eq(planItem.id_produto, product.id_produto))
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(
        and(
          eq(plan.id_plano, planId),
          eq(plan.id_empresa, tokenKeyData.company_id)
        )
      )
      .execute();

    if (result.length === 0) {
      return [];
    }

    return result as PlanProducts[];
  }
}
