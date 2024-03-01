import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  date,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clienteEndereco = mysqlTable("cliente_endereco", {
  id_cliente_endereco: int("id_cliente_endereco").notNull().default(sql`uuid_to_bin(uuid())`).primaryKey(),
  id_cliente: int("id_cliente"),
  tipo: mysqlEnum("tipo", ["Cobranca", "Envio"]).notNull().default("Cobranca"),
  primario: mysqlEnum("primario", ["Y", "N"]).notNull().default("N"),
  cep: varchar("cep", { length: 8 }),
  rua: varchar("rua", { length: 100 }),
  numero: varchar("numero", { length: 20 }),
  complemento: varchar("complemento", { length: 255 }),
  bairro: varchar("bairro", { length: 100 }),
  cidade: varchar("cidade", { length: 50 }),
  uf: varchar("uf", { length: 2 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});