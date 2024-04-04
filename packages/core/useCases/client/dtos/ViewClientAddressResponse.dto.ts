import { ClientShippingAddress } from "@core/common/enums/models/client";

export interface ViewClientAddressDTO {
  shipping_address_enum: ClientShippingAddress;
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

export interface ViewClientBillingAddressResponse extends ViewClientAddressDTO {
  shipping_address: boolean;
}
  