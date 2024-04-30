import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { PaymentType } from "@core/common/enums/PaymentType";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import {
  ITransactionCardIdRequest,
  ITransactionCardResponse,
} from "@core/interfaces/services/payment/ITransactionCard";
import { IZoopError } from "@core/interfaces/services/payment/IZoopError";
import { paymentApiInstance } from "./paymentApiInstance";

export async function createTransactionCardId(
  input: ITransactionCardIdRequest
): Promise<ResponseService<ITransactionCardResponse>> {
  try {
    const response = await paymentApiInstance.post<
      ITransactionCardResponse & IZoopError
    >(`/transactions`, {
      on_behalf_of: input.sellerId,
      description: input.description,
      payment_type: PaymentType.credit,
      source: {
        usage: input.usage,
        amount: input.amount,
        currency: "BRL",
        type: "card",
        card: {
          id: input.cardId,
        },
      },
    });

    if (response.status === HTTPStatusCode.CREATED) {
      return {
        status: true,
        data: response.data,
      };
    }

    return {
      status: false,
      httpStatusCode: response.status,
      message: response.data.error.message,
    };
  } catch (error: any) {
    throw new Error(error.response.data.error.category);
  }
}
