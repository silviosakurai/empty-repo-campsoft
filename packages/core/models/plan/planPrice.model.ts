import {
  mysqlTable,
  int,
  datetime,
  varchar,
  double,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const planPrice = mysqlTable("plano_preco", {
  id_plano: int("id_plano").notNull().primaryKey(),
  meses: int("meses").notNull().primaryKey().default(1),
  preco: double("preco"),
  desconto_porcentagem: double("desconto_porcentagem"),
  desconto_valor: double("desconto_valor"),
  preco_desconto: double("preco_desconto"),
  obs: varchar("obs", { length: 200 }),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
