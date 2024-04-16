export interface ICreateCustomer {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  cpf: string;
  birthDate?: Date;
  address?: ICreateCustomerAddress;
}

interface ICreateCustomerAddress {
  streetAddress: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state: string;
  countryCode: string;
  postalCode: string;
}
