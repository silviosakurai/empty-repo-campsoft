import {
  mysqlTable,
  int,
  binary,
  varchar,
  timestamp,
} from "drizzle-orm/mysql-core";

export const clientDeleted = mysqlTable("cliente_deletado", {
  id_cliente_deletado: int("id_cliente_deletado").primaryKey().autoincrement(),
  id_cliente: binary("id_cliente", { length: 16 })
    .default("uuid_to_bin(uuid())")
    .notNull(),
  email: varchar("email", { length: 100 }),
  telefone: varchar("telefone", { length: 11 }),
  cpf: varchar("cpf", { length: 11 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
