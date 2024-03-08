import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const urlShort = mysqlTable("url_encurtado", {
  id_url_encurtado: int("id_url_encurtado").notNull().primaryKey(),
  codigo: varchar("codigo", { length: 13 }),
  url: varchar("url", { length: 1000 }),
  contador: int("contador").default(0),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});