import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  double,
} from "drizzle-orm/mysql-core";

export const orderItemView = mysqlTable("pedido_item_view", {
  id_pedido_item: varchar("id_pedido_item", { length: 36 }),
  id_pedido: varchar("id_pedido", { length: 36 }),
  id_cliente: varchar("id_cliente", { length: 36 }),
  id_plano: int("id_plano"),
  id_produto: varchar("id_produto", { length: 10 }),
  id_presente: int("id_presente"),
  avulso: int("avulso"),
  item: varchar("item", { length: 50 }),
  cupom_carrinho_codigo: varchar("cupom_carrinho_codigo", { length: 12 }),
  id_afiliado_chave: varchar("id_afiliado_chave", { length: 32 }),
  valor_preco: double("valor_preco"),
  valor_cupom: double("valor_cupom").default(0),
  percentual_cupom: double("percentual_cupom").default(0),
  valor_total: double("valor_total").notNull().default(0),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
