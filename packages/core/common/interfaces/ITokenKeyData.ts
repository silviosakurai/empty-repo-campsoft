import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
export interface ITokenKeyData {
  acoes: PermissionsRoles[];
  id_api_key: number;
  id_parceiro: number;
  id_cargo: number;
}

export interface FindApiByKey {
  acao: string;
  id_api_key: number;
  id_parceiro: number;
  id_cargo: number;
}
