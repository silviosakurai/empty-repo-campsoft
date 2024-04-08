import { ClientShippingAddress } from "@core/common/enums/models/client";

export interface ViewClientBaseAddressResponse {
  zip_code: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  phone: string;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
}
export interface ViewClientAddressDTO extends ViewClientBaseAddressResponse{
  shipping_address: ClientShippingAddress;
}

export interface ViewClientBillingAddressResponse extends ViewClientBaseAddressResponse {
  shipping_address: boolean;
}
