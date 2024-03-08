import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  double,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const couponCartCode = mysqlTable("cupom_carrinho_codigo", {
  id_cupom_carrinho_codigo: varbinary("id_cupom_carrinho_codigo", {
    length: 16,
  })
    .notNull()
    .default(sql`uuid_to_bin(uuid())`)
    .primaryKey(),
  id_cupom_carrinho: int("id_cupom_carrinho"),
  cupom_carrinho_codigo: varchar("cupom_carrinho_codigo", {
    length: 10,
  }).notNull(),
  qnt_uso_max: int("qnt_uso_max", { unsigned: true }).default(1),
  qnt_uso_faltante: int("qnt_uso_faltante", { unsigned: true }).default(1),
  qnt_uso_por_cli: int("qnt_uso_por_cli", { unsigned: true }).default(1),
  desconto_percentual: double("desconto_percentual"),
  desconto_valor: double("desconto_valor"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
  deleted: mysqlEnum("deleted", ["Y", "N"]).default("N"),
});
