import {
  mysqlTable,
  int,
  varchar,
} from "drizzle-orm/mysql-core";

export const pedidoStatus = mysqlTable("pedido_status", {
  id_pedido_status: int("id_pedido_status").notNull().primaryKey(),
  pedido_status: varchar("pedido_status", { length: 50 }).notNull(),
  obs: varchar("obs", { length: 200 }).notNull(),
});