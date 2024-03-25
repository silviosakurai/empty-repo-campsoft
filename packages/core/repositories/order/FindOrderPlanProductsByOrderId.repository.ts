import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { and, eq, sql } from "drizzle-orm";
import * as schema from "@core/models";
import { product, productType, orderItem, order } from "@core/models";

@injectable()
export class FindOrderPlanProductsByOrderIdRepository {
  constructor(@inject("Database") private db: MySql2Database<typeof schema>) {}

  async find(orderId: string) {
    const result = await this.db
      .select({
        product_id: product.id_produto,
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
      .from(product)
      .innerJoin(orderItem, eq(orderItem.id_produto, product.id_produto))
      .innerJoin(order, eq(orderItem.id_pedido, order.id_pedido))
      .innerJoin(
        productType,
        eq(product.id_produto_tipo, productType.id_produto_tipo)
      )
      .where(and(eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result;
  }
}
