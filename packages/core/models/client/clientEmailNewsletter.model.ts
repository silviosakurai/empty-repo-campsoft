import { mysqlTable, int, datetime, varbinary } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clientEmailNewsletter = mysqlTable("cliente_email_newsletter", {
  id_cliente: varbinary("id_cliente", { length: 16 })
    .notNull()
    .default(sql`uuid_to_bin(uuid())`)
    .primaryKey(),
  id_cliente_email_tipo: int("id_cliente_email_tipo").notNull(),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
