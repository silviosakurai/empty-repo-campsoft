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

<<<<<<< HEAD
export interface ClientWithCompaniesResponse {
=======
export interface ClientListResponse {
>>>>>>> e9bac1769e682718ba4994a18357fc2e3e4d39e3
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
<<<<<<< HEAD
  user_type: number | null;
}

export interface ClientWithListCompaniesResponse {
  user_id: string | null;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  companies: Company[] | null;
}
=======
}

export interface ClientWithCompaniesListResponse {
  user_id: string;
  name: string;
  first_name: string;
  last_name: string;
  companies: Company[] | null;
}

export interface ListClientByGroupAndPartner {
  id_cliente: string;
  id_parceiro: number;
}
>>>>>>> e9bac1769e682718ba4994a18357fc2e3e4d39e3
