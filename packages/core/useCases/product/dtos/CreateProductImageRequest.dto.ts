import {
  productImageCreateParamsSchema,
  productImageCreateSchema,
} from "@core/schema/product/productImageCreateSchema";
import { Static } from "@sinclair/typebox";

export type CreateProductImageRequest = Static<typeof productImageCreateSchema>;

export type CreateProductImageParams = Static<
  typeof productImageCreateParamsSchema
>;

export type CreateProductImageInput = CreateProductImageRequest &
  CreateProductImageParams;
