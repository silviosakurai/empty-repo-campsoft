import { userBillingAddressResponseSchema } from "@core/schema/user/userBillingAddressResponseSchema";
import { userShippingAddressResponseSchema } from "@core/schema/user/userShippingAddressResponseSchema";
import { Static } from "@sinclair/typebox";

export type ViewClientBillingAddressResponse = Static<
  typeof userBillingAddressResponseSchema
>;

export type ViewClientShippingAddressResponse = Static<
  typeof userShippingAddressResponseSchema
>;
