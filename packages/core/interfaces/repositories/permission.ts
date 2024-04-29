import { permissionUserLoginSchema } from "@core/schema/permission/permissionUserLoginSchema";
import { Static } from "@sinclair/typebox";

export type PermissionFindByCliendId = Static<typeof permissionUserLoginSchema>;
