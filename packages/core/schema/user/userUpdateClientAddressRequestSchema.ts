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

export const userUpdateClientAddressShippingRequestSchema = Type.Object({
  shipping_address: Type.Boolean(),
  zip_code: Type.Optional(Type.String()),
  street: Type.Optional(Type.String()),
  number: Type.Optional(Type.String()),
  complement: Type.Optional(Type.String()),
  neighborhood: Type.Optional(Type.String()),
  phone: Type.Optional(Type.String()),
  city: Type.Optional(Type.String()),
  state: Type.Optional(Type.String()),
});
