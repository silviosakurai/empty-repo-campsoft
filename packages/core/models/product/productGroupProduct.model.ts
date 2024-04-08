import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const productGroupProduct = mysqlTable("produto_grupo_produto", {
  id_produto_grupo: int("id_produto_grupo").notNull().primaryKey(),
  id_produto: varchar("id_produto", { length: 10 }).notNull().primaryKey(),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
