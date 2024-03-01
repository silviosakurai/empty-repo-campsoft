import {
  mysqlTable,
  int,
  double,
  varchar,
} from "drizzle-orm/mysql-core";

export const pedidoPagGateway = mysqlTable("pedido_pag_gateway", {
  id_pedido_pag_gateway: int("id_pedido_pag_gateway").notNull().primaryKey(),
  pedido_pag_gateway: varchar("pedido_pag_gateway", { length: 50 }),
  transacao_valor: double("transacao_valor").default(0),
  transacao_percentual: double("transacao_percentual").default(0),
  obs: varchar("obs", { length: 50 }),
});