import {
  CouponRescueItemDeleted,
  CouponRescueItemRedeem,
  CouponRescueItemTypeTime,
} from "@core/common/enums/models/coupon";
import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  date,
  datetime,
} from "drizzle-orm/mysql-core";

export const couponRescueItem = mysqlTable("cupom_resgatar_item", {
  id_cupom_resgatar_item: int("id_cupom_resgatar_item").notNull().primaryKey(),
  id_cupom_resgatar: int("id_cupom_resgatar").notNull(),
  id_produto: varchar("id_produto", { length: 10 }),
  id_plano: int("id_plano"),
  tempo_tipo: mysqlEnum("tempo_tipo", [
    CouponRescueItemTypeTime.DAY,
    CouponRescueItemTypeTime.MONTH,
  ]),
  tempo: int("tempo"),
  validade_ate: datetime("validade_ate", { mode: "string" }),
  resgate_obrigatorio: mysqlEnum("resgate_obrigatorio", [
    CouponRescueItemRedeem.YES,
    CouponRescueItemRedeem.NO,
  ])
    .notNull()
    .default(CouponRescueItemRedeem.NO),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
  deleted: mysqlEnum("deleted", [
    CouponRescueItemDeleted.YES,
    CouponRescueItemDeleted.NO,
  ])
    .notNull()
    .default(CouponRescueItemDeleted.NO),
});
