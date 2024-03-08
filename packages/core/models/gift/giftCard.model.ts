import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const giftCard = mysqlTable("presente_cartao", {
  id_presente_cartao: int("id_presente_cartao").notNull().primaryKey(),
  status: mysqlEnum("status", ["ativo", "inativo"]).default("ativo"),
  cartao_tipo: varchar("cartao_tipo", { length: 50 }),
  cartao_nome: varchar("cartao_nome", { length: 50 }),
  imagem: varchar("imagem", { length: 150 }),
  colors: varchar("colors", { length: 50 }),
  positions_preview: varchar("positions_preview", { length: 255 }),
  positions_email: varchar("positions_email", { length: 255 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
