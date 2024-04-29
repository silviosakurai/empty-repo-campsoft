import { RoleContext } from "@core/common/enums/models/role";
import { mysqlTable, int, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";

export const roleAction = mysqlTable("cargo_acao", {
  id_cargo: int("id_cargo").notNull(),
  id_acao: int("id_acao").notNull(),
  contexto: mysqlEnum("contexto", [
    RoleContext.USER,
    RoleContext.GROUP,
  ]).notNull(),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
