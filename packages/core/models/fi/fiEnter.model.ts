import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  double,
  timestamp,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const fiEnter = mysqlTable("fi_entrada", {
  id_fi_entrada: int("id_fi_entrada").notNull().primaryKey(),
  parcela: int("parcela").notNull().default(1),
  tipo: mysqlEnum("tipo", ["E", "B", "EP"]).notNull().default("E"),
  fi_entrada_atrelado: int("fi_entrada_atrelado"),
  id_fi_conta_bancaria: int("id_fi_conta_bancaria"),
  id_fi_centro_custo: int("id_fi_centro_custo").notNull(),
  id_fi_conta_contabil_depara_tipo: int(
    "id_fi_conta_contabil_depara_tipo"
  ).notNull(),
  id_empresa: int("id_empresa"),
  id_fornecedor: int("id_fornecedor"),
  id_cliente: varchar("id_cliente", { length: 16 }),
  id_pedido_pagamento: varchar("id_pedido_pagamento", { length: 16 }),
  lancamento: varchar("lancamento", { length: 255 }),
  doc: varchar("doc", { length: 45 }),
  valor: double("valor").notNull(),
  valor_total: double("valor_total").notNull(),
  data: datetime("data", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  data_de_competencia: datetime("data_de_competencia", { mode: "string" }),
  data_vencimento: datetime("data_vencimento", { mode: "string" }),
  link_nf_pdf: varchar("link_nf_pdf", { length: 150 }),
  link_nf_xml: varchar("link_nf_xml", { length: 150 }),
  link_nf_comprovante: varchar("link_nf_comprovante", { length: 150 }),
  link_boleto: varchar("link_boleto", { length: 150 }),
  obs: varchar("obs", { length: 200 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
