import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const marketingProductSection = mysqlTable("marketing_produto_secoes", {
  marketing_produto_secoes_id: int("marketing_produto_secoes_id")
    .notNull()
    .primaryKey()
    .autoincrement(),
  id_produto: varchar("id_produto", { length: 10 }),
  titulo: varchar("titulo", { length: 200 }),
  url_imagem: varchar("url_imagem", { length: 1000 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
