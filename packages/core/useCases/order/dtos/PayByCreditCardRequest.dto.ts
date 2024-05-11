import { paymentCreditCardSchema } from "@core/schema/payment/paymentCreditCardSchema";
import { Static } from "@sinclair/typebox";

export type PayByCreditCardRequest = Static<typeof paymentCreditCardSchema>;
