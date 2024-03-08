import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const productType = mysqlTable("produto_tipo", {
  id_produto_tipo: int("id_produto_tipo").notNull().primaryKey(),
  produto_tipo: varchar("produto_tipo", { length: 50 }),
  obs: varchar("obs", { length: 200 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});