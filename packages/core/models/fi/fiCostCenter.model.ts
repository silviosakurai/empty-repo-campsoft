import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const fiCostCenter = mysqlTable("fi_centro_custo", {
  id_fi_centro_custo: int("id_fi_centro_custo").notNull().primaryKey(),
  centro_custo: varchar("centro_custo", { length: 100 }),
  area: mysqlEnum("area", ["M", "T", "P", "F", "RH", "RY", "J", "A"]),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});