import { Status } from "@core/common/enums/Status";
import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  float,
  timestamp,
} from "drizzle-orm/mysql-core";

export const reviews = mysqlTable("depoimentos", {
  id_depoimento: int("id_depoimento").notNull().primaryKey(),
  id_empresa: int("id_empresa"),
  status: mysqlEnum("status", [Status.ACTIVE, Status.INACTIVE]).notNull(),
  nome: varchar("nome", { length: 60 }).notNull(),
  depoimento: varchar("depoimento", { length: 250 }).notNull(),
  foto: varchar("foto", { length: 150 }).notNull(),
  nota: float("nota").notNull().default(5),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
