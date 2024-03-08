import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  date,
} from "drizzle-orm/mysql-core";

export const couponRescueItem = mysqlTable("cupom_resgatar_item", {
  id_cupom_resgatar_item: int("id_cupom_resgatar_item").notNull().primaryKey(),
  id_cupom_resgatar: int("id_cupom_resgatar").notNull(),
  id_produto: varchar("id_produto", { length: 10 }),
  id_plano: int("id_plano"),
  tempo_tipo: mysqlEnum("tempo_tipo", ["day", "month"]),
  tempo: int("tempo"),
  validade_ate: date("validade_ate"),
  resgate_obrigatorio: mysqlEnum("resgate_obrigatorio", ["Y", "N"])
    .notNull()
    .default("N"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
  deleted: mysqlEnum("deleted", ["Y", "N"]).notNull().default("N"),
});
