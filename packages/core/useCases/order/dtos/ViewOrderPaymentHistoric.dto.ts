import { orderHistoricViewSchema } from "@core/schema/order/orderHistoricViewSchema";
import { Static } from "@sinclair/typebox";

export type OrderHistoricViewerResponseDto = Static<
  typeof orderHistoricViewSchema
>;
