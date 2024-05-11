import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const marketingProductType = mysqlTable("marketing_produto_tipo", {
  marketing_produto_tipo_id: int("marketing_produto_tipo_id")
    .notNull()
    .primaryKey()
    .autoincrement(),
  tipo: varchar("tipo", { length: 200 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
