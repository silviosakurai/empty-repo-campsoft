import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const cupomCarrinho = mysqlTable("cupom_carrinho", {
  id_cupom_carrinho: int("id_cupom_carrinho").notNull().primaryKey(),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  cupom_carrinho: varchar("cupom_carrinho", { length: 50 }).notNull().default("0"),
  id_empresa: int("id_empresa").default(1),
  validade: datetime("validade"),
  obs: varchar("obs", { length: 200 }).notNull().default(""),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  deleted: mysqlEnum("deleted", ["Y", "N"]).notNull().default("N"),
});