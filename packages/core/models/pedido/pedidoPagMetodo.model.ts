import {
  mysqlTable,
  int,
  varchar,
} from "drizzle-orm/mysql-core";

export const pedidoPagMetodo = mysqlTable("pedido_pag_metodo", {
  id_pedido_pag_metodo: int("id_pedido_pag_metodo").notNull().primaryKey(),
  pedido_pag_metodo: varchar("pedido_pag_metodo", { length: 50 }).notNull().default("0"),
});