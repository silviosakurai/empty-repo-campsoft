import {
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";

export const emailFree = mysqlTable("email_gratis", {
  email_gratis: varchar("email_gratis", { length: 100 }).notNull().primaryKey(),
});