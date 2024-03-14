import {
  mysqlTable,
  int,
  datetime,
  mysqlEnum,
  binary,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { ClientMagicTokenStatus } from "@core/common/enums/models/client";

export const clientMagicToken = mysqlTable("cliente_magic_token", {
  id_cliente_magic_token: int("id_cliente_magic_token")
    .primaryKey()
    .autoincrement(),
  id_cliente: binary("id_cliente", { length: 16 })
    .default("uuid_to_bin(uuid())")
    .notNull(),
  token: varchar("token", { length: 500 }),
  status: mysqlEnum("status", [
    ClientMagicTokenStatus.YES,
    ClientMagicTokenStatus.NO,
  ])
    .default(ClientMagicTokenStatus.YES)
    .notNull(),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
