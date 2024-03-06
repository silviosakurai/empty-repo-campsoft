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

export const clientCompany = mysqlTable("cliente_empresa_dados", {
  id_cliente: binary("id_cliente", { length: 16 }).notNull().primaryKey(),
  id_empresa: int("id_empresa").notNull(),
  status: mysqlEnum("status", [
    ClientCompanyStatus.ACTIVE,
    ClientCompanyStatus.INACTIVE,
  ])
    .notNull()
    .default(ClientCompanyStatus.ACTIVE),
  cpf: varchar("cpf", { length: 11 }),
  telefone: varchar("telefone", { length: 11 }),
  email: varchar("email", { length: 100 }).notNull().default("ativo"),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
