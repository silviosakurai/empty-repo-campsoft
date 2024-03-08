import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  double,
} from "drizzle-orm/mysql-core";

export const marketplace = mysqlTable("marketplace", {
  id_marketplace: int("id_marketplace").notNull().primaryKey(),
  nome: varchar("nome", { length: 50 }).notNull().default("0"),
  percentual: int("percentual").notNull().default(0),
  valor: double("valor").notNull().default(0),
  id_parceiros: int("id_parceiros", { unsigned: true }),
  obs: varchar("obs", { length: 50 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
