import { AccessType } from "@core/common/enums/models/access";

export interface IAccessCreate {
  clientId: string;
  companyId: number;
  accessTypeId: AccessType;
}
