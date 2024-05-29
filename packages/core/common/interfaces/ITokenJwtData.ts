import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { RoleContext } from "@core/common/enums/models/role";

export interface ITokenJwtAccess {
  acao: PermissionsRoles;
  id_grupo: number | null;
  id_parceiro: number | null;
  id_cargo: number;
  contexto: RoleContext;
}

export interface ITokenJwtData {
  clientId: string;
  access: ITokenJwtAccess[];
}

export type UniqueAccessPermission = Omit<ITokenJwtAccess, "acao">;
