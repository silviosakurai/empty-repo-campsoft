import {
  mysqlTable,
  int,
  datetime,
  varchar,
  timestamp,
} from "drizzle-orm/mysql-core";

export const companyMonthSignature = mysqlTable("empresa_assinatura_mes", {
  ano: int("ano").notNull().primaryKey(),
  mes: int("mes").notNull(),
  id_assinatura_cliente: varchar("id_assinatura_cliente", { length: 16 }).notNull(),
  id_empresa: int("id_empresa").notNull(),
  id_cliente: varchar("id_cliente", { length: 16 }),
  data_da_cobranca: datetime("data_da_cobranca"),
  ciclo: int("ciclo").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});