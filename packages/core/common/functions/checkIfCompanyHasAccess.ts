import { AccessType } from "../enums/models/access";
import { ITokenJwtAccess } from "../interfaces/ITokenJwtData";

export function checkIfCompanyHasAccess(
  access: ITokenJwtAccess[],
  accessLevel: AccessType
): number[] {
  return access.filter((a) => a.accessTypeId === accessLevel).map((a) => a.companyId);
}
