import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  float,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import {
  FinanceSplitListAnticipation,
  FinanceSplitListChargeProcessingFee,
  FinanceSplitListChargeRecipientProcessingFee,
  FinanceSplitListIsGrossAmount,
  FinanceSplitListIsLiable,
  FinanceSplitListIsMain,
  FinanceSplitListPercentageAmount,
  FinanceSplitListStatus,
} from "@core/common/enums/models/financeSplitList";

export const financeSplitList = mysqlTable("financeiro_split_lista", {
  id_financeiro_split_lista: varchar("id_financeiro_split_lista", {
    length: 36,
  })
    .notNull()
    .primaryKey(),
  id_financeiro_split_regras: int("id_financeiro_split_regras").notNull(),
  sandbox: int("sandbox").default(1),
  id_fi_zoop_vendedor: varchar("id_fi_zoop_vendedor", { length: 36 }),
  id_fi_contas: int("id_fi_contas"),
  id_fi_zoop_vendedor_conta: varchar("id_fi_zoop_vendedor_conta", {
    length: 32,
  }),
  status: mysqlEnum("status", [
    FinanceSplitListStatus.ACTIVE,
    FinanceSplitListStatus.INACTIVE,
  ]).default(FinanceSplitListStatus.ACTIVE),
  principal: mysqlEnum("principal", [
    FinanceSplitListIsMain.YES,
    FinanceSplitListIsMain.NO,
  ]).default(FinanceSplitListIsMain.NO),
  liable: mysqlEnum("liable", [
    FinanceSplitListIsLiable.YES,
    FinanceSplitListIsLiable.NO,
  ]),
  charge_processing_fee: mysqlEnum("charge_processing_fee", [
    FinanceSplitListChargeProcessingFee.YES,
    FinanceSplitListChargeProcessingFee.NO,
  ]),
  charge_recipient_processing_fee: mysqlEnum(
    "charge_recipient_processing_fee",
    [
      FinanceSplitListChargeRecipientProcessingFee.YES,
      FinanceSplitListChargeRecipientProcessingFee.NO,
    ]
  ),
  is_gross_amount: mysqlEnum("is_gross_amount", [
    FinanceSplitListIsGrossAmount.YES,
    FinanceSplitListIsGrossAmount.NO,
  ]),
  percentage_amount: mysqlEnum("percentage_amount", [
    FinanceSplitListPercentageAmount.PERCENTAGE,
    FinanceSplitListPercentageAmount.AMOUNT,
  ]),
  valor: float("valor"),
  antecipacao: mysqlEnum("antecipacao", [
    FinanceSplitListAnticipation.YES,
    FinanceSplitListAnticipation.NO,
  ]),
  created_at: datetime("created_at", { mode: "string" }).default(sql`now()`),
  updated_at: datetime("updated_at", { mode: "string" }).default(sql`now()`),
});
