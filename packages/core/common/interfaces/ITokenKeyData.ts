import { Permissions } from "@core/common/enums/Permissions";
export interface ITokenKeyData {
  acoes: Permissions[];
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
