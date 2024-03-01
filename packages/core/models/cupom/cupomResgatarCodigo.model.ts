import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const cupomResgatarCodigo = mysqlTable("cupom_resgatar_codigo", {
  id_cupom_resgatar_codigo: int("id_cupom_resgatar_codigo").notNull().default(sql`uuid_to_bin(uuid())`).primaryKey(),
  id_cupom_resgatar: int("id_cupom_resgatar").notNull(),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  cupom_resgatar_codigo: varchar("cupom_resgatar_codigo", { length: 12 }).notNull(),
  numero_produtos: int("numero_produtos").notNull().default(1),
  qnt_uso_max: int("qnt_uso_max", { unsigned: true }).default(1),
  qnt_uso_faltante: int("qnt_uso_faltante", { unsigned: true }).default(1),
  qnt_uso_por_cli: int("qnt_uso_por_cli", { unsigned: true }).default(1),
  numero_lote_impresso: varchar("numero_lote_impresso", { length: 10 }),
  enviado_para: varchar("enviado_para", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted: mysqlEnum("deleted", ["Y", "N"]).notNull().default("N"),
});