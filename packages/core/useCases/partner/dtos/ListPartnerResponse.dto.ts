import { Static } from "@sinclair/typebox";
import { partnerListResponseSchema } from "@core/schema/partner/partnerListResponseSchema";

export type ListPartnerResponse = Static<typeof partnerListResponseSchema>;
