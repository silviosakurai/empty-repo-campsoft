import {
  mysqlTable,
  datetime,
  varchar,
  mysqlEnum,
  timestamp,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clientEmail = mysqlTable("cliente_email", {
  token: varbinary("token", { length: 16 }).notNull().primaryKey().default(sql`uuid_to_bin(uuid())`),
  id_cliente: varchar("id_cliente", { length: 16 }),
  email: varchar("email", { length: 200 }),
  enviado_email: mysqlEnum("enviado_email", ["Y", "N"]).default("N"),
  verificado: mysqlEnum("verificado", ["Y", "N"]).default("N"),
  verificado_data: datetime("verificado_data"),
  bounced: mysqlEnum("bounced", ["0", "1", "2"]).default("0"),
  complaint: mysqlEnum("complaint", ["0", "1"]).default("0"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});