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

export interface ICreateCustomerResponse {
  id: string;
  status: "active";
  resource: "buyer";
  account_balance: string;
  current_balance: string;
  first_name: string | null;
  last_name: string | null;
  taxpayer_id: string | null;
  description: string | null;
  email: string;
  phone_number: string | null;
  facebook: string | null;
  twitter: string | null;
  address: {
    line1: string | null;
    line2: string | null;
    line3: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country_code: string | null;
  } | null;
  delinquent: boolean;
  payment_methods: string[] | null;
  default_debit: string | null;
  default_credit: string | null;
  default_receipt_delivery_method: string | null;
  uri: string;
  metadata: {
    additionalProp: string;
  };
  created_at: Date;
  updated_at: Date;
}
