import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  date,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clientProductSignature = mysqlTable("assinatura_cliente_produto", {
  id_assinatura_cliente: varchar("id_assinatura_cliente", { length: 16 })
    .notNull()
    .primaryKey(),
  id_produto: varchar("id_produto", { length: 10 }).notNull(),
  processar: mysqlEnum("processar", ["Y", "N"]).notNull().default("Y"),
  subscribe_id: varchar("subscribe_id", { length: 36 }),
  status_campsoft: mysqlEnum("status_campsoft", ["inativo", "ativo"]).default(
    "inativo"
  ),
  obs: varchar("obs", { length: 30 }),
  atualizar_campsoft: mysqlEnum("atualizar_campsoft", ["Y", "N"])
    .notNull()
    .default("N"),
  data_ativacao: date("data_ativacao"),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
