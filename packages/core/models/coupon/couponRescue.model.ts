import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  date,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const couponRescue = mysqlTable("cupom_resgatar", {
  id_cupom_resgatar: int("id_cupom_resgatar").notNull().primaryKey(),
  status: mysqlEnum("status", ["ativo", "inativo"]).default("ativo"),
  cupom_resgatar: varchar("cupom_resgatar", { length: 30 }).notNull(),
  id_empresa: int("id_empresa"),
  validade: datetime("validade").default(sql`CURRENT_TIMESTAMP`),
  obs: varchar("obs", { length: 200 }),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deleted: mysqlEnum("deleted", ["Y", "N"]).notNull().default("N"),
});