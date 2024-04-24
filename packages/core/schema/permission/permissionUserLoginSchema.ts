import { Type } from "@sinclair/typebox";
import { Permissions } from "@core/common/enums/Permissions";

export const permissionUserLoginSchema = Type.Object({
  action: Type.String({ enum: Object.values(Permissions) }),
  company_id: Type.Union([Type.Number(), Type.Null()]),
});
