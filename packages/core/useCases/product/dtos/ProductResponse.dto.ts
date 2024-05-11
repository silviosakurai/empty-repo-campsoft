import { productDetailsWithPricesAndDatesAndHowToSchema } from "@core/schema/product/productDetailsWithPricesAndDatesAndHowToSchema";
import { productDetailsWithPricesAndDatesSchema } from "@core/schema/product/productDetailsWithPricesAndDatesSchema";
import {
  productViewSchema,
  productViewSchemaResponse,
} from "@core/schema/product/productViewSchema";
import { Static } from "@sinclair/typebox";

export type ProductResponse = Static<
  typeof productDetailsWithPricesAndDatesAndHowToSchema
>;

export type ProductResponseCrossSell = Static<
  typeof productDetailsWithPricesAndDatesSchema
>;

export type ProductViewResponse = Static<typeof productViewSchemaResponse>;

export type ProductView = Static<typeof productViewSchema>;
