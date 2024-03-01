import {
  mysqlTable,
  int,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const pedidoOrigem = mysqlTable("pedido_origem", {
  id_pedido_origem: int("id_pedido_origem").notNull().primaryKey(),
  pedido_origem: varchar("pedido_origem", { length: 50 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});