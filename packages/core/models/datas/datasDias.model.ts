import {
  mysqlTable,
  smallint,
  tinyint,
  date,
} from "drizzle-orm/mysql-core";

export const datasDias = mysqlTable("datas_dias", {
  data: date("data").notNull().primaryKey(),
  ano: smallint("ano"),
  mes: tinyint("mes"),
  dia: tinyint("dia"),
});