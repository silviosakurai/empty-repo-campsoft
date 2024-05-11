import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const marketingProduct = mysqlTable("marketing_produto", {
  marketing_produto_id: int("marketing_produto_id")
    .notNull()
    .primaryKey()
    .autoincrement(),
  marketing_produto_tipo_id: int("marketing_produto_tipo_id"),
  id_produto: varchar("id_produto", { length: 10 }),
  titulo: varchar("titulo", { length: 200 }),
  sub_titulo: varchar("sub_titulo", { length: 200 }),
  descricao: varchar("descricao", { length: 1000 }),
  url_imagem: varchar("url_imagem", { length: 1000 }),
  url_video: varchar("url_video", { length: 1000 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
