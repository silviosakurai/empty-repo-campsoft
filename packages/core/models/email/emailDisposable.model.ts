import {
  mysqlTable,
  int,
  varchar,
} from "drizzle-orm/mysql-core";

export const emailDisposable = mysqlTable("email_disposable", {
  id_email_disposable: int("id_email_disposable").notNull().primaryKey(),
  email_disposable: varchar("email_disposable", { length: 100 }).notNull(),
});