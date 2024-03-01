import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const couponCartValidItems = mysqlTable("cupom_carrinho_item_validos", {
  id_cupom_carrinho_item_validos: varbinary("id_cupom_carrinho_item_validos", { length: 16 }).notNull().default(sql`uuid_to_bin(uuid())`).primaryKey(),
  id_cupom_carrinho: int("id_cupom_carrinho").notNull(),
  id_produto: varchar("id_produto", { length: 10 }),
  id_plano: int("id_plano"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted: mysqlEnum("deleted", ["Y", "N"]).notNull().default("N"),
});