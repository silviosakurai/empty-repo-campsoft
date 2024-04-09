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
