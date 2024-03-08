import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const fiAccount = mysqlTable("fi_conta_contabil", {
  conta_contabil_analitica: varchar("conta_contabil_analitica", { length: 12 })
    .notNull()
    .primaryKey(),
  conta_contabil_descricao: varchar("conta_contabil_descricao", {
    length: 100,
  }),
  id_fi_bancos: int("id_fi_bancos"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
