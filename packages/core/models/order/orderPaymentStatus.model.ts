import {
  mysqlTable,
  int,
  varchar,
} from "drizzle-orm/mysql-core";

export const orderPaymentStatus = mysqlTable("pedido_pagamento_status", {
  id_pedido_pagamento_status: int("id_pedido_pagamento_status").notNull().primaryKey(),
  pedido_pagamento_status: varchar("pedido_pagamento_status", { length: 50 }).notNull(),
  obs: varchar("obs", { length: 200 }).notNull(),
});