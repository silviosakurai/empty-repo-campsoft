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

export interface ClientDto {
  user_id: unknown,
  name: string | null,
  first_name: string | null,
  last_name: string | null,
  birthday: unknown,
  email: string | null,
  phone: string | null,
  cpf: string | null,
  gender: string | null,
  company_id: number,
  company_name: string | null,
  user_type: number | null,
}

export interface ClientDtoResponse {
  user_id: string;
  name: string,
  first_name: string,
  last_name: string,
  companies: Company[] | null;
}