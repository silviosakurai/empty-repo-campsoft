import { mysqlTable, int, datetime, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const templateModule = mysqlTable("template_modulo", {
  id_template_modulo: int("id_template_modulo")
    .notNull()
    .primaryKey()
    .autoincrement(),
  modulo: varchar("modulo", { length: 255 }).notNull(),
  created_at: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
