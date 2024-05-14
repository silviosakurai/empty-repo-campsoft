import { orderHistoricViewSchema } from "@core/schema/order/orderHistoricViewSchema";
import { Static } from "@sinclair/typebox";

export enum OrderRecorrencia {
  NO = "0",
  YES = "1",
}

export enum OrderPaymentsMethodsEnum {
  CARD = "1",
  BOLETO = "2",
  FREE = "3",
  CASH = "4",
  APPLE_PAY = "5",
  PAID_VOUCHER = "6",
  COMMODITY = "7",
  VOUCHER = "8",
  PIX = "9",
  GIFT = "10",
  COUPON = "11",
  DEBIT = "12",
  EXTERNAL_LINK = "13",
}

export enum OrderStatusEnum {
  APPROVED = 1,
  CANCELED = 2,
  PENDING = 3,
  FAILED = 4,
  UPGRADED = 5,
}

export type OrderHistoricResponse = Static<typeof orderHistoricViewSchema>;
