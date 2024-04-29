import { mysqlTable, varchar, binary, int } from "drizzle-orm/mysql-core";

export const clientGroupsTree = mysqlTable("cliente_grupos_arvore", {
  id_cliente: binary("id_cliente", { length: 16 }),
  nome: varchar("nome", { length: 50 }),
  id_grupo: int("id_grupo"),
  id_parceiro: int("id_parceiro"),
});
