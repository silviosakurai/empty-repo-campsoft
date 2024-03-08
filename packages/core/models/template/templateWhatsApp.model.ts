import {
  mysqlTable,
  int,
  datetime,
  varchar,
  char,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const templateWhatsApp = mysqlTable("template_whatsapp", {
  id_template_whatsapp: int("id_template_whatsapp")
    .notNull()
    .primaryKey()
    .autoincrement(),
  id_empresa: int("id_empresa"),
  id_template_tipo: int("id_template_tipo").notNull(),
  id_template_modulo: int("id_template_modulo").notNull(),
  nome: char("nome", { length: 50 }),
  template: varchar("template", { length: 200 }),
  created_at: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
