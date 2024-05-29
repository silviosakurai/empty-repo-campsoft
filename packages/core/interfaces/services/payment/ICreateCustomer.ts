export interface ICreateCustomer {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number: string;
  taxpayer_id: string;
  birthdate?: string;
  address?: ICreateCustomerAddress;
}

interface ICreateCustomerAddress {
  line1?: string;
  line2?: string;
  line3?: string;
  neighborhood?: string;
  city?: string;
  state: string; // Código ISO 3166-2 para o estado, com duas letras. Ex.: "MG","RJ","PR"
  postal_code?: string; // CEP com 8 dígitos sem separador
  country_code: string; // ISO 3166-1 alpha-2 - códigos de país de duas letras. Valor padrão: "BR"
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
