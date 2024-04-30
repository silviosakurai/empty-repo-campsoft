import { mysqlTable, int, datetime, char, text } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const templateWhatsApp = mysqlTable("template_whatsapp", {
  id_template_whatsapp: int("id_template_whatsapp")
    .notNull()
    .primaryKey()
    .autoincrement(),
  id_parceiro: int("id_parceiro"),
  id_template_tipo: int("id_template_tipo").notNull(),
  id_template_modulo: int("id_template_modulo").notNull(),
  nome: char("nome", { length: 50 }),
  template: text("template"),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
