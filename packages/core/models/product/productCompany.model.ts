import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const productCompany = mysqlTable("produto_empresa", {
  id_produto: varchar("id_produto", { length: 10 }).notNull().primaryKey(),
  id_empresa: int("id_empresa").notNull().primaryKey(),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
