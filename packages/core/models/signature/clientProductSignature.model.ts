import {
  mysqlTable,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import {
  ClientProductSignatureProcess,
  ClientProductSignatureStatus,
  ClientProductSignatureUpdateCampsoft,
} from "@core/common/enums/models/signature";

export const clientProductSignature = mysqlTable("assinatura_cliente_produto", {
  id_assinatura_cliente: varchar("id_assinatura_cliente", { length: 16 })
    .notNull()
    .primaryKey(),
  id_produto: varchar("id_produto", { length: 10 }).notNull(),
  processar: mysqlEnum("processar", [
    ClientProductSignatureProcess.YES,
    ClientProductSignatureProcess.NO,
  ])
    .notNull()
    .default(ClientProductSignatureProcess.YES),
  status: mysqlEnum("status", [
    ClientProductSignatureStatus.INACTIVE,
    ClientProductSignatureStatus.ACTIVE,
  ]).default(ClientProductSignatureStatus.INACTIVE),
  subscribe_id: varchar("subscribe_id", { length: 36 }),
  obs: varchar("obs", { length: 30 }),
  atualizar_campsoft: mysqlEnum("atualizar_campsoft", [
    ClientProductSignatureUpdateCampsoft.YES,
    ClientProductSignatureUpdateCampsoft.NO,
  ])
    .notNull()
    .default(ClientProductSignatureUpdateCampsoft.NO),
  data_ativacao: datetime("data_ativacao", { mode: "string" }),
  data_agendamento: datetime("data_agendamento", { mode: "string" }),
  data_expiracao: datetime("data_expiracao", { mode: "string" }),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
