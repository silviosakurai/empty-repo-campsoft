import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  tinyint,
} from "drizzle-orm/mysql-core";

export const productGroup = mysqlTable("produto_grupo", {
  id_produto_grupo: int("id_produto_grupo").notNull().primaryKey(),
  produto_grupo: varchar("produto_grupo", { length: 50 }),
  icon: varchar("icon", { length: 150 }).notNull().default("1"),
  qtd_produtos_selecionaveis: tinyint("qtd_produtos_selecionaveis")
    .notNull()
    .default(1),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
