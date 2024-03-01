import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  date,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const assinaturaClienteView = mysqlTable("assinatura_cliente_view", {
  id_assinatura_cliente: varchar("id_assinatura_cliente", { length: 36 }),
  id_pedido: varchar("id_pedido", { length: 36 }),
  id_cliente: varchar("id_cliente", { length: 36 }),
  id_empresa: int("id_empresa"),
  ciclo: int("ciclo"),
  id_assinatura_status: int("id_assinatura_status").notNull(),
  id_plano: int("id_plano"),
  pag_order_sub: varchar("pag_order_sub", { length: 32 }),
  recorrencia: mysqlEnum("recorrencia", ["0", "1"]).default("0"),
  recorrencia_periodo: int("recorrencia_periodo").notNull().default(1),
  data_inicio: date("data_inicio"),
  data_assinatura_ate: date("data_assinatura_ate"),
  data_proxima_cobranca: date("data_proxima_cobranca"),
  data_ultimo_pagamento: date("data_ultimo_pagamento"),
  data_cancelamento: date("data_cancelamento"),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});