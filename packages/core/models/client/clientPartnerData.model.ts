import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  binary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { ClientCompanyStatus } from "@core/common/enums/models/clientCompany";

export const clientPartnerData = mysqlTable("cliente_parceiro_dados", {
  id_cliente: binary("id_cliente", { length: 16 }).notNull().primaryKey(),
  id_parceiro: int("id_parceiro").notNull(),
  status: mysqlEnum("status", [
    ClientCompanyStatus.ACTIVE,
    ClientCompanyStatus.INACTIVE,
  ])
    .notNull()
    .default(ClientCompanyStatus.ACTIVE),
  cpf: varchar("cpf", { length: 11 }),
  telefone: varchar("telefone", { length: 11 }),
  email: varchar("email", { length: 100 }),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
