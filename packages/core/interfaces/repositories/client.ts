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

interface Company {
  company_id: number;
  company_name: string;
}

export interface ClientListResponse {
  user_id: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  birthday: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  gender: string | null;
  company_id: number;
  company_name: string | null;
  user_type?: number | null;
}

export interface ClientWithCompaniesListResponse {
  user_id: string;
  name: string;
  first_name: string;
  last_name: string;
  companies: Company[] | null;
}

export interface ClientCardRepositoryInput {
  expiration_month: number;
  expiration_year: number;
  externalId: string;
  tokenId: string;
  brand?: string;
  default: boolean;
  first4Digits: string;
  last4Digits?: string;
}

export interface ListClientByGroupAndPartner {
  id_cliente: string;
  id_parceiro: number;
}
