import { ClientStatus } from "@core/common/enums/models/client";

export interface FindClientByCpfEmailPhoneInput {
  cpf: string;
  email: string;
  phone: string;
}

export interface FindClientByEmailPhoneInput {
  email: string;
  phone: string;
}

export interface IPasswordRecoveryMethods {
  clientId: string;
  name: string;
  profileImage: string;
  email: string;
  phone: string;
}

export interface ClientEmailCreatorInput {
  email: string;
  emailType: number;
  clientId: string;
}

export interface ClientEmailViewResponse {
  clientId: string;
  token: string;
  emailTypeId: number;
  hasNewsletter: boolean;
}

export interface IUserExistsFunction {
  email: string;
  cpf: string;
  phone: string;
}

export interface CompanyResponse {
  company_id: number | null;
  company_name: string | null;
  position_id: number | null;
  position_name: string | null;
}

export interface ClientListResponse {
  user_id: string;
  status: ClientStatus;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  gender: string | null;
}

export interface ClientWithCompaniesListResponse {
  user_id: string;
  status: ClientStatus;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  gender: string | null;
  companies: CompanyResponse[];
}

export interface ListClientByGroupAndPartner {
  id_cliente: string;
  id_parceiro: number;
}
