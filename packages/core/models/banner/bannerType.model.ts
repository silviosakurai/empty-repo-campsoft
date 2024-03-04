import {
  mysqlTable,
  int,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const bannerType = mysqlTable("banner_tipo", {
  id_banner_tipo: int("id_banner_tipo").notNull().primaryKey(),
  banner_tipo: varchar("banner_tipo", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});