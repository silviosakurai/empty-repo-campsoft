export interface UpdateClientAddressRequest {
  shipping_address?: boolean;
  zip_code: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  phone: string;
  city: string;
  state: string;
}
