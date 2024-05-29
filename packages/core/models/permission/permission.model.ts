import { mysqlTable, int, timestamp, varbinary } from "drizzle-orm/mysql-core";

export const permission = mysqlTable("permissao", {
  id_api_key: int("id_api_key"),
  id_cliente: varbinary("id_cliente", { length: 16 }),
  id_grupo: int("id_grupo"),
  id_parceiro: int("id_parceiro"),
  id_cargo: int("id_cargo").notNull(),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
