import { ClientGender, ClientStatus } from "@core/common/enums/models/client";
import {
  mysqlTable,
  varchar,
  mysqlEnum,
  date,
  timestamp,
  bigint,
  binary,
} from "drizzle-orm/mysql-core";

export const client = mysqlTable("cliente", {
  id_cliente: binary("id_cliente", { length: 16 })
    .default("uuid_to_bin(uuid())")
    .notNull()
    .primaryKey(),
  status: mysqlEnum("status", [
    ClientStatus.ACTIVE,
    ClientStatus.INACTIVE,
    ClientStatus.DELETED,
  ])
    .notNull()
    .default(ClientStatus.ACTIVE),
  nome: varchar("nome", { length: 50 }),
  sobrenome: varchar("sobrenome", { length: 50 }),
  data_nascimento: date("data_nascimento"),
  foto: varchar("foto", { length: 70 }),
  email: varchar("email", { length: 100 }),
  telefone: varchar("telefone", { length: 11 }).notNull(),
  cpf: varchar("cpf", { length: 11 }),
  senha: varchar("senha", { length: 65 }),
  sexo: mysqlEnum("sexo", [ClientGender.MALE, ClientGender.FEMALE]),
  obs: varchar("obs", { length: 50 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
