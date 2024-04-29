import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { ITokenJwtAccess } from "@core/common/interfaces/ITokenJwtData";

export interface ViewClientRequest {
  tokenJwtData: ITokenJwtAccess;
  permissionRoles: PermissionsRoles[];
  userId: string;
}
