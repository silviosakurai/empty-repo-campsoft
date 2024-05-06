import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { CouponRescueStatus } from "@core/common/enums/models/coupon";

export const couponRescue = mysqlTable("cupom_resgatar", {
  id_cupom_resgatar: int("id_cupom_resgatar").notNull().primaryKey(),
  status: mysqlEnum("status", [
    CouponRescueStatus.ACTIVE,
    CouponRescueStatus.INACTIVE,
  ]).default(CouponRescueStatus.ACTIVE),
  cupom_resgatar: varchar("cupom_resgatar", { length: 30 }).notNull(),
  id_parceiro: int("id_parceiro"),
  validade: datetime("validade", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  obs: varchar("obs", { length: 200 }),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
