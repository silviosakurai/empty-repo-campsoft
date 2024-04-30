import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const productPartner = mysqlTable("produto_parceiro", {
  id_produto: varchar("id_produto", { length: 10 }).notNull(),
  id_parceiro: int("id_parceiro").notNull(),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
