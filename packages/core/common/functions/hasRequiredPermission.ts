import { Permissions } from "@core/common/enums/Permissions";

export function hasRequiredPermission(
  actions: Permissions[],
  permissions: Permissions[]
): boolean {
  if (!permissions || !permissions.length || !actions || !actions.length) {
    return false;
  }

  return permissions.some((permission) => actions.includes(permission));
}
