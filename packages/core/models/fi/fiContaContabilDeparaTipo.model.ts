import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const fiContaContabilDeparaTipo = mysqlTable("fi_conta_contabil_depara_tipo", {
  id_fi_conta_contabil_depara_tipo: int("id_fi_conta_contabil_depara_tipo").notNull().primaryKey(),
  descricao: varchar("descricao", { length: 100 }),
  tipo: mysqlEnum("tipo", ["D", "R"]),
  grupo: varchar("grupo", { length: 100 }),
  obs: varchar("obs", { length: 200 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});