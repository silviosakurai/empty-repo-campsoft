import { Gender, Sandbox, Status } from "@core/common/enums/models/client";
import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  date,
  timestamp,
  bigint,
  binary,
} from "drizzle-orm/mysql-core";

export const client = mysqlTable("cliente", {
  id_cliente: binary("id_cliente", { length: 16 }).notNull().primaryKey(),
  status: mysqlEnum("status", [Status.ACTIVE, Status.INACTIVE])
    .notNull()
    .default(Status.ACTIVE),
  id_cliente_tipo: int("id_cliente_tipo").notNull().default(1),
  id_facebook: bigint("id_facebook", { mode: "bigint", unsigned: true }),
  nome: varchar("nome", { length: 50 }),
  sobrenome: varchar("sobrenome", { length: 50 }),
  data_nascimento: date("data_nascimento"),
  foto: varchar("foto", { length: 70 }),
  email: varchar("email", { length: 100 }),
  telefone: varchar("telefone", { length: 11 }).notNull(),
  cpf: varchar("cpf", { length: 11 }),
  senha: varchar("senha", { length: 65 }),
  senha_campsoft: varchar("senha_campsoft", { length: 100 }),
  sexo: mysqlEnum("sexo", [Gender.MALE, Gender.FEMALE]),
  sms_validacao: varchar("sms_validacao", { length: 6 }),
  cliente_hash: varchar("cliente_hash", { length: 32 }),
  cliente_zoop: varchar("cliente_zoop", { length: 32 }),
  sandbox: mysqlEnum("sandbox", [Sandbox.YES, Sandbox.NO]).default(Sandbox.NO),
  obs: varchar("obs", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
