import {
  mysqlTable,
  int,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const companyType = mysqlTable("empresa_tipo", {
  id_empresa_tipo: int("id_empresa_tipo").notNull().primaryKey(),
  empresa_tipo: varchar("empresa_tipo", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});