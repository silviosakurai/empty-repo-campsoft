import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  double,
} from "drizzle-orm/mysql-core";

export const pdvRegisteredGift = mysqlTable("pdv_brindes_cadastrados", {
  id_pdv_brindes_cadastrados: int("id_pdv_brindes_cadastrados")
    .notNull()
    .primaryKey(),
  status: mysqlEnum("status", ["Disponivel", "Falta"]),
  brinde_nome: varchar("brinde_nome", { length: 50 }).notNull().default(""),
  valor: double("valor"),
  quantidade: int("quantidade").default(0),
  obs: varchar("obs", { length: 50 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
