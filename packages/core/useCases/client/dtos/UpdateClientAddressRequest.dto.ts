import {
  userUpdateClientAddressRequestSchema,
  userUpdateClientAddressShippingRequestSchema,
} from "@core/schema/user/userUpdateClientAddressRequestSchema";
import { Static } from "@sinclair/typebox";

export type UpdateClientAddressBillingRequest = Static<
  typeof userUpdateClientAddressRequestSchema
>;

export type UpdateClientAddressShippingRequest = Static<
  typeof userUpdateClientAddressShippingRequestSchema
>;
