import { Type } from "@sinclair/typebox";

export const userShippingAddressResponseSchema = Type.Object({
  zip_code: Type.String(),
  street: Type.String(),
  number: Type.String(),
  complement: Type.String(),
  neighborhood: Type.String(),
  phone: Type.String(),
  city: Type.String(),
  state: Type.String(),
  created_at: Type.String(),
  updated_at: Type.String(),
});
