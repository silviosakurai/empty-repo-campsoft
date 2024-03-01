import {
  mysqlTable,
  int,
  datetime,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const whatsappTemplantes = mysqlTable("whatsapp_templantes", {
  id_whatsapp_templantes: int("id_whatsapp_templantes").notNull().primaryKey(),
  nome: varchar("nome", { length: 50 }),
  templante: varchar("templante", { length: 2000 }),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});