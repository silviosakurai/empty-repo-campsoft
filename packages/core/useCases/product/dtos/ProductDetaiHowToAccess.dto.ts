import { productHowToAccess } from "@core/schema/product/productHowToAccess";
import { productHowToAccessManager } from "@core/schema/product/productHowToAccessManager";
import { Static } from "@sinclair/typebox";

export type ProductDetaiHowToAccess = Static<typeof productHowToAccess>;

export type UpdateParams = Static<typeof productHowToAccessManager>;
