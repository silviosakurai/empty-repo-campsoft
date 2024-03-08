import { mysqlTable, int, datetime, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const templateEmail = mysqlTable("template_email", {
  id_template_email: int("id_template_email")
    .notNull()
    .primaryKey()
    .autoincrement(),
  id_empresa: int("id_empresa").notNull(),
  id_template_tipo: int("id_template_tipo").notNull(),
  id_template_modulo: int("id_template_modulo").notNull(),
  template_nome: varchar("template_nome", { length: 50 }),
  de_nome: varchar("de_nome", { length: 100 })
    .notNull()
    .default("Mania de App"),
  de_email: varchar("de_email", { length: 100 })
    .notNull()
    .default("contato@maniadeapp.com.br"),
  responder_para: varchar("responder_para", { length: 100 })
    .notNull()
    .default("contato@maniadeapp.com.br"),
  assunto: varchar("assunto", { length: 255 }).notNull().default("Email Geral"),
  email_txt: varchar("email_txt", { length: 1000 }),
  email_html: varchar("email_html", { length: 1000 }),
  created_at: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
