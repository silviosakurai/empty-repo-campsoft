import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const clientEmailType = mysqlTable("cliente_email_tipo", {
  id_cliente_email_tipo: int("id_cliente_email_tipo").notNull().primaryKey(),
  desativavel: mysqlEnum("desativavel", ["Y", "N"]).notNull().default("Y"),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  obs: varchar("obs", { length: 200 }).notNull(),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
