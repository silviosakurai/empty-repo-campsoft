import { Type } from "@sinclair/typebox";

export const userUpdateClientAddressRequestSchema = Type.Object({
  zip_code: Type.String(),
  street: Type.String(),
  number: Type.String(),
  complement: Type.String(),
  neighborhood: Type.String(),
  phone: Type.String(),
  city: Type.String(),
  state: Type.String(),
});

export const userPatchClientAddressRequestSchema = Type.Object({
  shipping_address: Type.Boolean(),
});
