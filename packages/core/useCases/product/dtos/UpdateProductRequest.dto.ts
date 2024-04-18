import { productUpdateSchema } from "@core/schema/product/productUpdateSchema";
import { Static } from "@sinclair/typebox";

export type UpdateProductRequest = Static<typeof productUpdateSchema>;
