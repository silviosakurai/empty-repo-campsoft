import { Type } from "@sinclair/typebox";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";

export const permissionUserLoginSchema = Type.Object({
  action: Type.String({ enum: Object.values(PermissionsRoles) }),
  company_id: Type.Union([Type.Number(), Type.Null()]),
});
