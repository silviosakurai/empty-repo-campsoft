import { Type } from "@sinclair/typebox";

export const reviewListResponseSchema = Type.Array(
  Type.Object({
    company_id: Type.Optional(Type.Number()),
    review_id: Type.Number(),
    status: Type.String(),
    name: Type.String(),
    review: Type.String(),
    photo: Type.String(),
    rating: Type.Number(),
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
  }),
);
