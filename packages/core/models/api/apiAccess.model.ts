import { ApiStatus } from "@core/common/enums/models/api";
import {
  mysqlTable,
  varbinary,
  int,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";

export const apiAccess = mysqlTable("api_acesso", {
  id_api_acesso: int("id_api_acesso").notNull().primaryKey(),
  api_nome: varbinary("api_nome", { length: 50 }),
  api_status: mysqlEnum("api_status", [ApiStatus.ACTIVE, ApiStatus.INACTIVE]),
  api_chave: varbinary("api_chave", { length: 32 }),
  id_fi_zoop_split_regra: int("id_fi_zoop_split_regra"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
