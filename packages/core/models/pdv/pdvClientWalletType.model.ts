import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const pdvClientWalletType = mysqlTable("pdv_cliente_carteira_tipo", {
  id_pdv_cliente_carteira_tipo: int("id_pdv_cliente_carteira_tipo")
    .notNull()
    .primaryKey(),
  tipo: varchar("tipo", { length: 100 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
