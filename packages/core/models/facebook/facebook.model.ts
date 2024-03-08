import {
  mysqlTable,
  timestamp,
  varchar,
  mysqlEnum,
  bigint,
} from "drizzle-orm/mysql-core";

export const facebook = mysqlTable("facebook", {
  id_facebook: bigint("id_facebook", { mode: "number", unsigned: true })
    .notNull()
    .primaryKey(),
  name: varchar("name", { length: 150 }),
  first_name: varchar("first_name", { length: 50 }),
  last_name: varchar("last_name", { length: 50 }),
  email: varchar("email", { length: 255 }),
  link: varchar("link", { length: 255 }),
  gender: mysqlEnum("gender", ["M", "F", "U"]),
  locale: varchar("locale", { length: 255 }),
  timezone: varchar("timezone", { length: 255 }),
  updated_time: varchar("updated_time", { length: 255 }),
  verified: varchar("verified", { length: 255 }),
  photourl: varchar("photourl", { length: 500 }),
  access_token_site: varchar("access_token_site", { length: 255 }),
  access_token_app: varchar("access_token_app", { length: 255 }),
  access_token_site_expiracao: timestamp("access_token_site_expiracao", {
    mode: "string",
  }),
  access_token_app_expiracao: timestamp("access_token_app_expiracao", {
    mode: "string",
  }),
  facebook_login_site_valido: mysqlEnum("facebook_login_site_valido", [
    "Y",
    "N",
  ]),
  facebook_login_app_valido: mysqlEnum("facebook_login_app_valido", ["Y", "N"]),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});