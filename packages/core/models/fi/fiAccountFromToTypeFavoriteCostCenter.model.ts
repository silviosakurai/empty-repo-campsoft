import { mysqlTable, int, timestamp } from "drizzle-orm/mysql-core";

export const fiAccountFromToTypeFavoriteCostCenter = mysqlTable(
  "fi_conta_contabil_depara_tipo_favorito_centro_custo",
  {
    id_fi_centro_cunsto: int("id_fi_centro_cunsto").notNull().primaryKey(),
    id_fi_conta_contabil_depara_tipo: int("id_fi_conta_contabil_depara_tipo")
      .notNull()
      .primaryKey(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
  }
);
