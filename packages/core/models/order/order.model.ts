import { OrderRecorrencia } from "@core/common/enums/models/order";

import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  double,
  varbinary,
  boolean,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const order = mysqlTable("pedido", {
  id_pedido: varbinary("id_pedido", { length: 16 })
    .notNull()
    .primaryKey()
    .default(sql`uuid_to_bin(uuid())`),
  id_pedido_anterior: varbinary("id_cliente", { length: 16 }),
  id_cliente: varbinary("id_cliente", { length: 16 }),
  id_vendedor: varbinary("id_vendedor", { length: 16 }),
  id_empresa: int("id_empresa").notNull(),
  id_pedido_status: int("id_pedido_status").notNull(),
  recorrencia: mysqlEnum("recorrencia", [
    OrderRecorrencia.NO,
    OrderRecorrencia.YES,
  ]).default(OrderRecorrencia.NO),
  recorrencia_periodo: int("recorrencia_periodo").notNull().default(1),
  valor_preco: double("valor_preco").notNull().default(0.0),
  valor_desconto: double("valor_desconto").notNull().default(0.0),
  valor_total: double("valor_total").notNull().default(0.0),
  pedido_parcelas_valor: double("pedido_parcelas_valor"),
  pedido_parcelas_vezes: int("pedido_parcelas_vezes"),
  cupom_carrinho_codigo: varchar("cupom_carrinho_codigo", { length: 12 }),
  cupom_resgatar_codigo: varchar("cupom_resgatar_codigo", { length: 12 }),
  ativacao_imediata: boolean("ativacao_imediata").default(true),
  cliente_email: varchar("cliente_email", { length: 100 }),
  cliente_primeiro_nome: varchar("cliente_primeiro_nome", { length: 50 }),
  cliente_ultimo_nome: varchar("cliente_ultimo_nome", { length: 50 }),
  cliente_cpf: varchar("cliente_cpf", { length: 11 }),
  cliente_telefone: varchar("cliente_telefone", { length: 11 }),
  audio_s3: varchar("audio_s3", { length: 150 }),
  pdf_s3: varchar("pdf_s3", { length: 150 }),
  obs: varchar("obs", { length: 50 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
