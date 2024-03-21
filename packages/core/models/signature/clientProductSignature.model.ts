import {
  mysqlTable,
  datetime,
  varchar,
  mysqlEnum,
  date,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import {
  ClientProductSignatureProcess,
  ClientProductSignatureStatusCampsoft,
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
  subscribe_id: varchar("subscribe_id", { length: 36 }),
  status_campsoft: mysqlEnum("status_campsoft", [
    ClientProductSignatureStatusCampsoft.INACTIVE,
    ClientProductSignatureStatusCampsoft.ACTIVE,
  ]).default(ClientProductSignatureStatusCampsoft.INACTIVE),
  obs: varchar("obs", { length: 30 }),
  atualizar_campsoft: mysqlEnum("atualizar_campsoft", [
    ClientProductSignatureUpdateCampsoft.YES,
    ClientProductSignatureUpdateCampsoft.NO,
  ])
    .notNull()
    .default(ClientProductSignatureUpdateCampsoft.NO),
  data_ativacao: date("data_ativacao"),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
