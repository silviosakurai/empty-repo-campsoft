import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  text,
  json,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const emailTemplates = mysqlTable("email_templates", {
  id_email_templates: int("id_email_templates").notNull().primaryKey(),
  id_api_acesso: int("id_api_acesso"),
  id_empresa: int("id_empresa"),
  id_email_tipo: int("id_email_tipo").notNull(),
  template_nome: varchar("template_nome", { length: 50 }),
  email_categoria: mysqlEnum("email_categoria", ["boas-vindas", "voucher", "compra-aprovada", "compra-pendente", "validar-email", "renovar-ifood", "assinatura-cancelada", "codigo-ativacao", "link-pagamento"]),
  de_nome: varchar("de_nome", { length: 100 }).notNull().default("Mania de App"),
  de_email: varchar("de_email", { length: 100 }).notNull().default("contato@maniadeapp.com.br"),
  responder_para: varchar("responder_para", { length: 100 }).notNull().default("contato@maniadeapp.com.br"),
  titulo: varchar("titulo", { length: 255 }).notNull().default("Email Geral"),
  email_arquivo: varchar("email_arquivo", { length: 50 }),
  email_txt: text("email_txt"),
  email_html: text("email_html"),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  campo_obrigatorio: json("campo_obrigatorio").notNull(),
});