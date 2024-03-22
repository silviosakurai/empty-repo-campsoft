import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  double,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const order = mysqlTable("pedido", {
  id_pedido: varbinary("id_pedido", { length: 16 })
    .notNull()
    .primaryKey()
    .default(sql`uuid_to_bin(uuid())`),
  id_empresa: int("id_empresa").notNull(),
  id_pedido_status: int("id_pedido_status").notNull(),
  id_fi_contas_split_regra: int("id_fi_contas_split_regra"),
  id_fi_zoop_split_regra: int("id_fi_zoop_split_regra"),
  id_cliente: int("id_cliente"),
  id_vendedor: int("id_vendedor"),
  recorrencia: mysqlEnum("recorrencia", ["0", "1"]).default("0"),
  recorrencia_periodo: int("recorrencia_periodo").notNull().default(1),
  valor_preco: double("valor_preco").notNull().default(0.0),
  valor_desconto: double("valor_desconto").notNull().default(0.0),
  valor_total: double("valor_total").notNull().default(0.0),
  taxa_meio_pagamento: double("taxa_meio_pagamento").notNull(),
  pedido_parcelas_valor: double("pedido_parcelas_valor"),
  pedido_parcelas_vezes: int("pedido_parcelas_vezes"),
  id_pedido_origem: int("id_pedido_origem"),
  id_marketplace: int("id_marketplace"),
  marketplace_id: varchar("marketplace_id", { length: 50 }),
  cupom_carrinho_codigo: varchar("cupom_carrinho_codigo", { length: 12 }),
  cupom_resgatar_codigo: varchar("cupom_resgatar_codigo", { length: 12 }),
  cliente_email: varchar("cliente_email", { length: 100 }),
  cliente_primeiro_nome: varchar("cliente_primeiro_nome", { length: 50 }),
  cliente_ultimo_nome: varchar("cliente_ultimo_nome", { length: 50 }),
  cliente_cpf: varchar("cliente_cpf", { length: 11 }),
  cliente_telefone: varchar("cliente_telefone", { length: 11 }),
  sandbox: mysqlEnum("sandbox", ["Y", "N"]).default("N"),
  remote_ip: varchar("remote_ip", { length: 16 }),
  obs: varchar("obs", { length: 50 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
