import { ClientCompanyStatus } from "@core/common/enums/models/clientCompany";

export interface IClientConnectClientAndCompany {
  clientId: string;
  companyId: number;
  cpf?: string;
  phoneNumber?: string;
  status?: ClientCompanyStatus;
}