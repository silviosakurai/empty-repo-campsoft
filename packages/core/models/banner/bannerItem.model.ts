import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { BannerItemFormat, BannerItemStatus } from "@core/common/enums/models/banner";

export const bannerItem = mysqlTable("banner_item", {
  id_banner_item: int("id_banner_item").autoincrement().notNull().primaryKey(),
  id_banner: int("id_banner"),
  status: mysqlEnum("status", [
    BannerItemStatus.ACTIVE,
    BannerItemStatus.INACTIVE,
  ])
    .notNull()
    .default(BannerItemStatus.ACTIVE),
  banner_item: varchar("banner_item", { length: 50 }),
  descricao: varchar("descricao", { length: 200 }),
  ordem: int("ordem"),
  formato: mysqlEnum("formato", [BannerItemFormat.HTML, BannerItemFormat.IMG]),
  banner_data_in: datetime("banner_data_in", { mode: "string" }),
  banner_data_fim: datetime("banner_data_fim", { mode: "string" }),
  url_img_desk: varchar("url_img_desk", { length: 255 }),
  url_img_mobile: varchar("url_img_mobile", { length: 255 }),
  link: varchar("link", { length: 150 }),
  html: varchar("html", { length: 4000 }),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
