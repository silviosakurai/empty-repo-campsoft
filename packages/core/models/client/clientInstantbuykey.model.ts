import {
  mysqlTable,
  int,
  datetime,
  varchar,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clientInstantbuykey = mysqlTable("cliente_instantbuykey", {
  id_cliente_instantbuykey: varbinary("id_cliente_instantbuykey", {
    length: 16,
  })
    .notNull()
    .default(sql`uuid_to_bin(uuid())`)
    .primaryKey(),
  id_cliente: int("id_cliente"),
  pag_cc_instantbuykey: varchar("pag_cc_instantbuykey", {
    length: 32,
  }).notNull(),
  pag_cc_id: varchar("pag_cc_id", { length: 32 }).notNull(),
  cartao_nome: varchar("cartao_nome", { length: 64 }),
  cartao_documento: varchar("cartao_documento", { length: 20 }),
  cartao_numero: varchar("cartao_numero", { length: 16 }),
  cartao_bandeira: varchar("cartao_bandeira", { length: 10 }),
  cartao_validade: varchar("cartao_validade", { length: 7 }),
  cartao_status: varchar("cartao_status", { length: 10 }),
  cartao_valido: varchar("cartao_valido", { length: 10 }),
  cartao_verificado: varchar("cartao_verificado", { length: 10 }),
  cartao_tipo: varchar("cartao_tipo", { length: 10 }),
  endreco_linha1: varchar("endreco_linha1", { length: 256 }),
  endreco_linha2: varchar("endreco_linha2", { length: 128 }),
  cep: varchar("cep", { length: 16 }),
  cidade: varchar("cidade", { length: 64 }),
  estado: varchar("estado", { length: 2 }),
  pais: varchar("pais", { length: 2 }),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
