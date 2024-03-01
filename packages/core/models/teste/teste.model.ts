import {
  mysqlTable,
  varbinary,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const teste = mysqlTable("teste", {
  id_teste: varbinary("id_teste", { length: 16 }).notNull().default(sql`uuid_to_bin(uuid())`),
  charrr: varchar("charrr", { length: 16 }),
});