import { reviewListResponseSchema } from "@core/schema/review/previewListResponseSchema";
import { Static } from "@sinclair/typebox";

export type ReviewListerResponseDto = Static<typeof reviewListResponseSchema>;
