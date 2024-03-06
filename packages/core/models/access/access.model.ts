import {
  mysqlTable,
  varbinary,
  int,
  datetime,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { AccessStatus } from "@core/common/enums/models/access";

export const access = mysqlTable("acesso", {
  id_acesso: varbinary("id_acesso", { length: 16 })
    .notNull()
    .default("uuid_to_bin(uuid())")
    .primaryKey(),
  id_cliente: varbinary("id_cliente", { length: 16 }),
  id_api_acesso: int("id_api_acesso"),
  id_empresa: int("id_empresa"),
  id_acesso_tipo: int("id_acesso_tipo"),
  status: mysqlEnum("status", [AccessStatus.ACTIVE, AccessStatus.INACTIVE])
    .notNull()
    .default(AccessStatus.ACTIVE),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
