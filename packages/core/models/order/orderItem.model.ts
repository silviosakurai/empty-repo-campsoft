import {
  mysqlTable,
  int,
  varbinary,
  varchar,
  double,
  timestamp,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const orderItem = mysqlTable("pedido_item", {
  id_pedido_item: varbinary("id_pedido_item", { length: 16 })
    .notNull()
    .primaryKey()
    .default(sql`uuid_to_bin(uuid())`),
  id_pedido: varbinary("id_pedido", { length: 16 }),
  id_cliente: varbinary("id_cliente", { length: 16 }),
  id_plano: int("id_plano"),
  id_produto: varchar("id_produto", { length: 10 }),
  id_presente: int("id_presente"),
  avulso: int("avulso"),
  item: varchar("item", { length: 50 }),
  cupom_carrinho_codigo: varchar("cupom_carrinho_codigo", { length: 12 }),
  id_afiliado_chave: varchar("id_afiliado_chave", { length: 32 }),
  valor_preco: double("valor_preco"),
  valor_cupom: double("valor_cupom").notNull().default(0),
  percentual_cupom: double("percentual_cupom").notNull().default(0),
  desconto_produto: double("desconto_produto"),
  valor_total: double("valor_total").notNull().default(0),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
