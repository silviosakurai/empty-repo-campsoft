import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const plan = mysqlTable("plano", {
  id_plano: int("id_plano").notNull().primaryKey(),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  visivel_site: mysqlEnum("visivel_site", ["Y", "N"]).notNull().default("Y"),
  ordem: int("ordem"),
  id_empresa: int("id_empresa"),
  plano: varchar("plano", { length: 50 }),
  intervalo: int("intervalo"),
  intervalo_tipo: mysqlEnum("intervalo_tipo", ["day", "month", "year"]),
  imagem: varchar("imagem", { length: 200 }),
  icon: varchar("icon", { length: 200 }),
  descricao: varchar("descricao", { length: 1000 }),
  descricao_curta: varchar("descricao_curta", { length: 500 }),
  url_caminho: varchar("url_caminho", { length: 150 }),
  meta_title: varchar("meta_title", { length: 100 }),
  meta_keyword: varchar("meta_keyword", { length: 100 }),
  meta_description: varchar("meta_description", { length: 100 }),
  obs: varchar("obs", { length: 100 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});