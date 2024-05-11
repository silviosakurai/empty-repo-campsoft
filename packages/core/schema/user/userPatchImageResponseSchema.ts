import { Type } from "@sinclair/typebox";

export const userPutAddressResponseSchema = Type.Object({
  zip_code: Type.String(),
  street: Type.String(),
  number: Type.String(),
  complement: Type.String(),
  neighborhood: Type.String(),
  phone: Type.String(),
  city: Type.String(),
  state: Type.String(),
});
