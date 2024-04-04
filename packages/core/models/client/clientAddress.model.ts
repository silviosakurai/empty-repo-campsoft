import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { ClientAddress, ClientShippingAddress } from "@core/common/enums/models/client";

export const clientAddress = mysqlTable("cliente_endereco", {
  id_cliente_endereco: varbinary("id_cliente_endereco", { length: 16 })
    .notNull()
    .default(sql`uuid_to_bin(uuid())`)
    .primaryKey(),
  id_cliente: int("id_cliente"),
  tipo: mysqlEnum("tipo", [ClientAddress.BILLING, ClientAddress.SHIPPING]).notNull().default(ClientAddress.BILLING),
  endereco_envio: mysqlEnum("endereco_envio", [ClientShippingAddress.YES, ClientShippingAddress.NO]).notNull().default(ClientShippingAddress.NO),
  cep: varchar("cep", { length: 8 }),
  rua: varchar("rua", { length: 100 }),
  numero: varchar("numero", { length: 20 }),
  complemento: varchar("complemento", { length: 255 }),
  bairro: varchar("bairro", { length: 100 }),
  cidade: varchar("cidade", { length: 50 }),
  uf: varchar("uf", { length: 2 }),
  telefone: varchar("telefone", { length: 11 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
