import {
  mysqlTable,
  datetime,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const pagarmeLog = mysqlTable("pagarme_log", {
  pagarme_log_id: varchar("pagarme_log_id", { length: 50 }).notNull(),
  data_received: varchar("data_received", { length: 10000 }),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});