import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  double,
} from "drizzle-orm/mysql-core";

export const planItem = mysqlTable("plano_item", {
  id_plano_item: int("id_plano_item").autoincrement().notNull().primaryKey(),
  id_plano: int("id_plano").notNull(),
  id_produto: varchar("id_produto", { length: 10 }),
  id_produto_grupo: int("id_produto_grupo"),
  percentual_do_plano: double("percentual_do_plano"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
