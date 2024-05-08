import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

export function tokenKeyDataMock(tokenKey?: Partial<ITokenKeyData>) {
  const keyData: ITokenKeyData = {
    acoes: tokenKey?.acoes ?? [PermissionsRoles.AUTHENTICATION_LOGIN],
    id_api_key: tokenKey?.id_api_key ?? 1,
    id_cargo: tokenKey?.id_cargo ?? 1,
    id_parceiro: tokenKey?.id_parceiro ?? 1,
  };

  return keyData;
}
