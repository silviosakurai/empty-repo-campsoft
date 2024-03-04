import {
  mysqlTable,
  int,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const vonexToken = mysqlTable("vonex_token", {
  id_access_token: int("id_access_token").notNull().primaryKey(),
  conta_mercadolivre: varchar("conta_mercadolivre", { length: 20 }),
  usuario_login: varchar("usuario_login", { length: 50 }),
  id_user_ml: int("id_user_ml"),
  expires_token: int("expires_token"),
  access_token: varchar("access_token", { length: 255 }),
  refresh_token: varchar("refresh_token", { length: 255 }),
  id_cupom_resgatar_lista_livros_info: int("id_cupom_resgatar_lista_livros_info"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});