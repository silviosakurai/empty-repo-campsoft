import {
  mysqlTable,
  int,
  datetime,
  varchar,
  varbinary,
  double,
  timestamp,
  text,
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
  id_pedido_pagamento_status: int("id_pedido_pagamento_status"),
  valor_preco: double("valor_preco").notNull().default(0.0),
  valor_desconto: double("valor_desconto").notNull().default(0.0),
  valor_desconto_ordem_anterior: double("valor_desconto_ordem_anterior")
    .notNull()
    .default(0.0),
  valor_total: double("valor_total").notNull().default(0.0),
  pedido_parcelas_valor: double("pedido_parcelas_valor"),
  pedido_parcelas_vezes: int("pedido_parcelas_vezes"),
  id_pedido_pag_metodo: int("id_pedido_pag_metodo"),
  data_pagamento: datetime("data_pagamento", { mode: "string" }),
  voucher: varchar("voucher", { length: 50 }),
  card_id: varbinary("card_id", { length: 16 }),
  pag_trans_id: varchar("pag_trans_id", { length: 50 }),
  pag_info_adicional: text("pag_info_adicional"),
  codigo_pagamento: varchar("codigo_pagamento", { length: 500 }),
  taxa_meio_pagamento: double("taxa_meio_pagamento"),
  data_vencimento: timestamp("data_vencimento", { mode: "string" }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
