import { EmailBlock, EmailType } from "@core/common/enums/models/email";
import { mysqlTable, int, varchar, mysqlEnum } from "drizzle-orm/mysql-core";

export const emailDomains = mysqlTable("email_dominios", {
  id_email_dominios: int("id_email_disposable")
    .notNull()
    .primaryKey()
    .autoincrement(),
  email: varchar("email", { length: 100 }).notNull(),
  tipo: mysqlEnum("tipo", [EmailType.DISPOSABLE, EmailType.GRATIS]),
  bloquear: mysqlEnum("bloquear", [EmailBlock.YES, EmailBlock.NO]),
});
