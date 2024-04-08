import {
  mysqlTable,
  int,
  datetime,
  varchar,
  varbinary,
  double,
  json,
  timestamp,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const orderPayment = mysqlTable("pedido_pagamento", {
  id_pedido_pagamento: varbinary("id_pedido_pagamento", { length: 16 })
    .notNull()
    .primaryKey()
    .default(sql`uuid_to_bin(uuid())`),
  id_pedido_pagamento_atrelado: varbinary("id_pedido_pagamento_atrelado", {
    length: 16,
  }),
  id_pedido: varbinary("id_pedido", { length: 16 }),
  id_cliente: varbinary("id_cliente", { length: 16 }),
  id_assinatura_cliente: varbinary("id_assinatura_cliente", { length: 16 }),
  id_pedido_pagamento_status: int("id_pedido_pagamento_status"),
  valor_preco: double("valor_preco").notNull().default(0.0),
  valor_desconto: double("valor_desconto").notNull().default(0.0),
  valor_desconto_ordem_anterior: double("valor_desconto_ordem_anterior")
    .notNull()
    .default(0.0),
  valor_total: double("valor_total").notNull().default(0.0),
  pedido_parcelas_valor: double("pedido_parcelas_valor"),
  pedido_parcelas_vezes: int("pedido_parcelas_vezes"),
  id_pedido_pag_gateway: int("id_pedido_pag_gateway"),
  id_pedido_pag_metodo: int("id_pedido_pag_metodo"),
  data_pagamento: datetime("data_pagamento", { mode: "string" }),
  voucher: varchar("voucher", { length: 50 }),
  pag_cc_nome: varchar("pag_cc_nome", { length: 64 }),
  pag_cc_tipo: varchar("pag_cc_tipo", { length: 15 }),
  pag_cc_exp: varchar("pag_cc_exp", { length: 7 }),
  pag_cc_numero_cartao: varchar("pag_cc_numero_cartao", { length: 14 }),
  pag_cc_instantbuykey: varchar("pag_cc_instantbuykey", { length: 25 }),
  pag_cc_card_zoop: varchar("pag_cc_card_zoop", { length: 32 }),
  pag_order_key: varchar("pag_order_key", { length: 25 }),
  pag_order_sub: varchar("pag_order_sub", { length: 32 }),
  pag_trans_id: varchar("pag_trans_id", { length: 25 }),
  pag_transaction: varchar("pag_transaction", { length: 500 }),
  pag_transaction_raw: json("pag_transaction_raw"),
  pag_info_adicional: varchar("pag_info_adicional", { length: 2000 }),
  pag_customer_id: varchar("pag_customer_id", { length: 32 }),
  taxa_meio_pagamento: double("taxa_meio_pagamento"),
  obs: varchar("obs", { length: 200 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
