import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";

export function hasRequiredPermission(
  actions: PermissionsRoles[],
  permissions: PermissionsRoles[]
): boolean {
  if (!permissions?.length || !actions?.length) {
    return false;
  }

  return permissions.some((permission) => actions.includes(permission));
}
