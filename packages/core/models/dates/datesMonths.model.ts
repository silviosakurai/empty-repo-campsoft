import {
  mysqlTable,
  int,
  date,
} from "drizzle-orm/mysql-core";

export const datesMonths = mysqlTable("datas_meses", {
  datas_ultimo_dia_mes: date("datas_ultimo_dia_mes"),
  ano: int("ano").notNull().primaryKey(),
  mes: int("mes").notNull(),
  dia: int("dia"),
});