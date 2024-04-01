import { productDetailHowToAccessWithDatesSchema } from "@core/schema/product/productDetailHowToAccessWithDatesSchema";
import { productDetailsWithPricesAndDatesSchema } from "@core/schema/product/productDetailsWithPricesAndDatesSchema";
import { Static } from "@sinclair/typebox";

export type ProductResponse = Static<
  typeof productDetailHowToAccessWithDatesSchema
>;

export type ProductResponseCrossSell = Static<
  typeof productDetailsWithPricesAndDatesSchema
>;
