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
