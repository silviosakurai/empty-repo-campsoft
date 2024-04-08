import {
  mysqlTable,
  datetime,
  varchar,
  mysqlEnum,
  timestamp,
  varbinary,
  int,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import {
  ClientEmailVerified,
  ClientSentEmail,
} from "@core/common/enums/models/clientEmail";

export const clientEmail = mysqlTable("cliente_email", {
  token: varbinary("token", { length: 16 })
    .notNull()
    .primaryKey()
    .default(sql`uuid_to_bin(uuid())`),
  id_cliente: varchar("id_cliente", { length: 16 }),
  email: varchar("email", { length: 200 }),
  enviado_email: mysqlEnum("enviado_email", [
    ClientSentEmail.YES,
    ClientSentEmail.NO,
  ]).default(ClientSentEmail.NO),
  verificado: mysqlEnum("verificado", [
    ClientEmailVerified.YES,
    ClientEmailVerified.NO,
  ]).default(ClientEmailVerified.NO),
  verificado_data: datetime("verificado_data", { mode: "string" }),
  bounced: mysqlEnum("bounced", ["0", "1", "2"]).default("0"),
  complaint: mysqlEnum("complaint", ["0", "1"]).default("0"),
  id_cliente_email_tipo: int("id_cliente_email_tipo"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
