import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { ClientSignatureRecorrencia } from "@core/common/enums/models/signature";

export const clientSignature = mysqlTable("assinatura_cliente", {
  id_assinatura_cliente: varbinary("id_assinatura_cliente", { length: 16 })
    .default("uuid_to_bin(uuid())")
    .notNull()
    .primaryKey(),
  id_cliente: varbinary("id_cliente", { length: 16 }),
  id_pedido: varbinary("id_pedido", { length: 16 }),
  id_empresa: int("id_empresa"),
  ciclo: int("ciclo"),
  id_assinatura_status: int("id_assinatura_status").notNull(),
  id_plano: int("id_plano").notNull(),
  pag_order_sub: varchar("pag_order_sub", { length: 32 }),
  recorrencia: mysqlEnum("recorrencia", [
    ClientSignatureRecorrencia.NO,
    ClientSignatureRecorrencia.YES,
  ]).default(ClientSignatureRecorrencia.NO),
  recorrencia_periodo: int("recorrencia_periodo").notNull().default(1),
  data_inicio: datetime("data_inicio", { mode: "string" }),
  data_assinatura_ate: datetime("data_assinatura_ate", { mode: "string" }),
  data_proxima_cobranca: datetime("data_proxima_cobranca", { mode: "string" }),
  data_ultimo_pagamento: datetime("data_ultimo_pagamento", { mode: "string" }),
  data_cancelamento: datetime("data_cancelamento", { mode: "string" }),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
