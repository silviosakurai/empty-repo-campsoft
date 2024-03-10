import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { TemplateDeactivatable } from "@core/common/enums/models/template";

export const templateType = mysqlTable("template_tipo", {
  id_template_tipo: int("id_template_tipo")
    .notNull()
    .primaryKey()
    .autoincrement(),
  desativavel: mysqlEnum("desativavel", [
    TemplateDeactivatable.YES,
    TemplateDeactivatable.NO,
  ])
    .default(TemplateDeactivatable.YES)
    .notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  obs: varchar("obs", { length: 200 }).notNull(),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
