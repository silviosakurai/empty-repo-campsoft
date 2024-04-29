import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { CouponRescueStatus } from "@core/common/enums/models/coupon";

export const couponCart = mysqlTable("cupom_carrinho", {
  id_cupom_carrinho: int("id_cupom_carrinho").notNull().primaryKey(),
  status: mysqlEnum("status", [
    CouponRescueStatus.ACTIVE,
    CouponRescueStatus.INACTIVE,
  ])
    .notNull()
    .default(CouponRescueStatus.ACTIVE),
  cupom_carrinho: varchar("cupom_carrinho", { length: 50 })
    .notNull()
    .default("0"),
  id_parceiro: int("id_parceiro").notNull(),
  validade: datetime("validade", { mode: "string" }),
  obs: varchar("obs", { length: 200 }).notNull().default(""),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
