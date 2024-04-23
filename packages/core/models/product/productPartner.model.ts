import { mysqlTable, int, timestamp } from "drizzle-orm/mysql-core";

export const productPartner = mysqlTable("produto_parceiro", {
  id_produto: int("id_produto").notNull(),
  id_parceiro: int("id_parceiro").notNull(),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
