import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";

export const gift = mysqlTable("presente", {
  id_presente: int("id_presente").notNull().primaryKey(),
  id_pedido_item: varchar("id_pedido_item", { length: 16 }),
  id_cliente_presenteador: int("id_cliente_presenteador").notNull(),
  id_presente_cartao: int("id_presente_cartao"),
  email_disparado: mysqlEnum("email_disparado", ["Y", "N"]).notNull().default("N"),
  presenteador_nome: varchar("presenteador_nome", { length: 150 }),
  presenteado_email: varchar("presenteado_email", { length: 132 }).notNull(),
  mensagem: varchar("mensagem", { length: 3000 }),
  id_cliente_presenteado: int("id_cliente_presenteado"),
  cupom_presente: varchar("cupom_presente", { length: 13 }),
  link_presente: varchar("link_presente", { length: 255 }),
  presente_data: datetime("presente_data"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});