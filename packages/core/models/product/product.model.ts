import { Status } from "@core/common/enums/Status";
import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  double,
} from "drizzle-orm/mysql-core";

export const product = mysqlTable("produto", {
  id_produto: varchar("id_produto", { length: 10 }).notNull().primaryKey(),
  status: mysqlEnum("status", [Status.ACTIVE, Status.INACTIVE]).default(
    Status.ACTIVE
  ),
  id_produto_tipo: int("id_produto_tipo"),
  produto: varchar("produto", { length: 50 }),
  descricao: varchar("descricao", { length: 1000 }),
  descricao_curta: varchar("descricao_curta", { length: 500 }),
  frases_marketing: varchar("frases_marketing", { length: 200 }),
  frase_mini: varchar("frase_mini", { length: 80 }),
  conteudista_nome: varchar("conteudista_nome", { length: 50 }),
  imagem: varchar("imagem", { length: 150 }),
  icon: varchar("icon", { length: 150 }),
  logo: varchar("logo", { length: 150 }),
  imagem_background: varchar("imagem_background", { length: 150 }),
  url_caminho: varchar("url_caminho", { length: 100 }),
  url_acesso_produto: varchar("url_acesso_produto", { length: 100 }),
  meta_title: varchar("meta_title", { length: 80 }),
  meta_keyword: varchar("meta_keyword", { length: 100 }),
  meta_description: varchar("meta_description", { length: 100 }),
  como_acessar_desk: varchar("como_acessar_desk", { length: 1000 }),
  como_acessar_mob: varchar("como_acessar_mob", { length: 1000 }),
  como_acessar_url: varchar("como_acessar_url", { length: 150 }),
  como_acessar_url_ios: varchar("como_acessar_url_ios", { length: 150 }),
  como_acessar_url_and: varchar("como_acessar_url_and", { length: 150 }),
  preco: double("preco"),
  preco_face: double("preco_face"),
  obs: varchar("obs", { length: 100 }),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
