import { mysqlTable, int, datetime, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const templateType = mysqlTable("template_tipo", {
  id_template_tipo: int("id_template_tipo")
    .notNull()
    .primaryKey()
    .autoincrement(),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  obs: varchar("obs", { length: 200 }).notNull(),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
