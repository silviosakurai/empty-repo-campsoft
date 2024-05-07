import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { PaymentType } from "@core/common/enums/PaymentType";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import {
  ITransactionCardIdRequest,
  ITransactionCardResponse,
} from "@core/interfaces/services/payment/ITransactionCard";
import { IZoopError } from "@core/interfaces/services/payment/IZoopError";
import { paymentApiInstance } from "./paymentApiInstance";
import { existsInApiErrorCategoryZoop } from "@core/common/functions/existsInApiErrorCategoryZoop";
import { ApiErrorCategoryZoop } from "@core/common/enums/ApiErrorCategoryZoop";

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
    if (existsInApiErrorCategoryZoop(error.response.data.error.category)) {
      throw new Error(error.response.data.error.category);
    }

    throw new Error(ApiErrorCategoryZoop.PaymentCardIdRefused);
  }
}
