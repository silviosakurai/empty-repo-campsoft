import {
  userPatchClientAddressRequestSchema,
  userUpdateClientAddressRequestSchema,
} from "@core/schema/user/userUpdateClientAddressRequestSchema";
import { Static } from "@sinclair/typebox";

export type UpdateClientAddressRequest = Static<
  typeof userUpdateClientAddressRequestSchema
>;

export type PatchClientAddressResponse = Static<
  typeof userPatchClientAddressRequestSchema
>;
