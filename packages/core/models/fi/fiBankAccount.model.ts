import {
  mysqlTable,
  int,
  datetime,
  varchar,
  double,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const fiBankAccount = mysqlTable("fi_conta_bancaria", {
  id_fi_conta_bancaria: int("id_fi_conta_bancaria").notNull().primaryKey(),
  id_fi_conta_bancaria_atrelado: int("id_fi_conta_bancaria_atrelado"),
  id_fi_bancos: int("id_fi_bancos", { unsigned: true }),
  data: datetime("data"),
  lancamento: varchar("lancamento", { length: 100 }),
  doc: varchar("doc", { length: 10 }),
  credito: double("credito"),
  debito: double("debito"),
  saldo: double("saldo"),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});