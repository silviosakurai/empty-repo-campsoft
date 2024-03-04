import {
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";

export const routeGroup = mysqlTable("rotas_grupo", {
  id_rotas_grupo: varchar("id_rotas_grupo", { length: 20 }).notNull().primaryKey(),
  obs: varchar("obs", { length: 50 }).notNull(),
});