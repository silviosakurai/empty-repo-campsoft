import { mysqlTable, int, datetime, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const smsTemplates = mysqlTable("sms_templantes", {
  id_sms_templantes: int("id_sms_templantes")
    .notNull()
    .primaryKey()
    .autoincrement(),
  nome: varchar("nome", { length: 50 }),
  templante: varchar("templante", { length: 200 }),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
