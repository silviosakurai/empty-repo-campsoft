import { ApiStatus } from "@core/common/enums/models/api";
import {
  mysqlTable,
  varbinary,
  int,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";

export const apiKey = mysqlTable("api_acesso", {
  id_api_key: int("id_api_key").notNull().primaryKey(),
  api_nome: varbinary("api_nome", { length: 50 }),
  api_status: mysqlEnum("api_status", [ApiStatus.ACTIVE, ApiStatus.INACTIVE]),
  api_chave: varbinary("api_chave", { length: 32 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
