import { Static } from "@sinclair/typebox";
import { partnerSchema } from "@core/schema/partner/partnerSchema";

export type PartnerResponse = Static<
  typeof partnerSchema
>;
