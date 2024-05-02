import { OrderPayments } from "@core/interfaces/repositories/order";
import { OrderPaymentsMethodsEnum } from "../enums/models/order";

export function enrichPaymentOrder(
  orderPayments: OrderPayments[]
): OrderPayments[] {
  return orderPayments.map((orderPayment) => {
    if (
      orderPayment.type_id &&
      orderPayment.type_id.toString() === OrderPaymentsMethodsEnum.CARD
    ) {
      return {
        ...orderPayment,
        credit_card: {
          brand: orderPayment.credit_card?.brand,
          number: orderPayment.credit_card?.number,
          credit_card_id: orderPayment.credit_card?.credit_card_id,
        },
        voucher: null,
        boleto: null,
        pix: null,
      };
    }

    if (
      orderPayment.type_id &&
      orderPayment.type_id.toString() === OrderPaymentsMethodsEnum.BOLETO
    ) {
      return {
        ...orderPayment,
        credit_card: null,
        voucher: null,
        boleto: {
          url: orderPayment.boleto?.url,
          code: orderPayment.boleto?.code,
          expire_at: orderPayment.boleto?.expire_at,
        },
        pix: null,
      };
    }

    if (
      orderPayment.type_id &&
      orderPayment.type_id.toString() === OrderPaymentsMethodsEnum.PIX
    ) {
      return {
        ...orderPayment,
        credit_card: null,
        voucher: null,
        boleto: null,
        pix: {
          url: orderPayment.pix?.url,
          code: orderPayment.pix?.code,
          expire_at: orderPayment.pix?.expire_at,
        },
      };
    }

    return {
      ...orderPayment,
      credit_card: null,
      voucher: null,
      boleto: null,
      pix: null,
    };
  });
}
