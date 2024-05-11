import { PartnerStatus } from "@core/common/enums/models/partner";
import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  bigint,
} from "drizzle-orm/mysql-core";

export const partner = mysqlTable("parceiro", {
  id_parceiro: int("id_parceiro"),
  id_parceiro_tipo: int("id_parceiro_tipo"),
  status: mysqlEnum("status", [PartnerStatus.ACTIVE, PartnerStatus.INACTIVE])
    .notNull()
    .default(PartnerStatus.ACTIVE),
  nome_fantasia: varchar("nome_fantasia", { length: 50 }),
  razao_social: varchar("razao_social", { length: 50 }),
  nome_responsavel: varchar("nome_responsavel", { length: 50 }),
  sobrenome_responsavel: varchar("sobrenome_responsavel", { length: 50 }),
  email_responsavel: varchar("email_responsavel", { length: 100 }),
  telefone: bigint("telefone", { mode: "number", unsigned: true }),
  cnpj: int("cnpj", { unsigned: true }),
  obs: varchar("obs", { length: 150 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});