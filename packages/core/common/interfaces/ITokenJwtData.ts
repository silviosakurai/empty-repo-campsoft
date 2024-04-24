import { Permissions } from "@core/common/enums/Permissions";

export interface ITokenJwtAccess {
  acao: Permissions;
  id_grupo: number | null;
  id_parceiro: number | null;
  id_cargo: number;
}

export interface ITokenJwtData {
  clientId: string;
  access: ITokenJwtAccess[];
}
