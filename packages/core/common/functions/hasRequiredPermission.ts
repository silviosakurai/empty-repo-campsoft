import { ITokenKeyData } from "../interfaces/ITokenKeyData";
import { Permissions } from "@core/common/enums/Permissions";

export function hasRequiredPermission(
  responseAuth: ITokenKeyData | null,
  permissions: Permissions[]
): boolean {
  if (!responseAuth || responseAuth.acoes.length === 0) {
    return false;
  }

  return permissions.some((permission) =>
    responseAuth.acoes.includes(permission)
  );
}
