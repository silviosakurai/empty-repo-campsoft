import {
  mysqlTable,
  varbinary,
  datetime,
  double,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const pedidoPagamentoSplit = mysqlTable("pedido_pagamento_split", {
  id_pedido_pagamento_split: varbinary("id_pedido_pagamento_split", { length: 16 }).notNull().primaryKey().default(sql`uuid_to_bin(uuid())`),
  id_pedido: varbinary("id_pedido", { length: 16 }),
  percentage: double("percentage"),
  amount: double("amount"),
  is_gross_amount: mysqlEnum("is_gross_amount", ["Y", "N"]),
  receivable_amount: double("receivable_amount"),
  receivable_gross_amount: double("receivable_gross_amount"),
  created_at: datetime("created_at").default(sql`now()`),
  updated_at: datetime("updated_at").default(sql`now()`),
});