import { ClientCompanyStatus } from "@core/common/enums/models/clientCompany";

export interface IClientConnectClientAndCompany {
  clientId: string;
  companyId: number;
  cpf?: string;
  phoneNumber?: string;
  email?: string;
  status?: ClientCompanyStatus;
}

export interface LoginUserTFA {
  clientId: string | null;
  login: string;
}

export interface LoginEmail {
  email: string;
  clientId?: string | null;
}
