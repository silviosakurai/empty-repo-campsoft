import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  binary,
  double,
} from "drizzle-orm/mysql-core";

export const productCrossSell = mysqlTable("produto_cross_sell", {
  id_produto_cross_sell: binary("id_cliente", { length: 16 })
    .default("uuid_to_bin(uuid())")
    .notNull()
    .primaryKey(),
  id_plano: int("id_plano"),
  id_produto: varchar("id_produto", { length: 10 }),
  meses: int("meses"),
  preco_desconto: double("preco_desconto"),
  desconto_valor: double("desconto_valor"),
  desconto_porcentagem: double("desconto_porcentagem"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
