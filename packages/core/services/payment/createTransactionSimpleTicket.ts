import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { PaymentType } from "@core/common/enums/PaymentType";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import {
  ITransactionSimpleTicketRequest,
  ITransactionSimpleTicketResponse,
} from "@core/interfaces/services/payment/ITransactionSimpleTicket";
import { IZoopError } from "@core/interfaces/services/payment/IZoopError";
import { paymentApiInstance } from "./paymentApiInstance";

export async function createTransactionSimpleTicket(
  input: ITransactionSimpleTicketRequest
): Promise<ResponseService<ITransactionSimpleTicketResponse>> {
  try {
    const response = await paymentApiInstance.post<
      ITransactionSimpleTicketResponse & IZoopError
    >(`/transactions`, {
      on_behalf_of: input.sellerId,
      customer: input.customerId,
      amount: input.amount,
      currency: "BRL",
      description: input.description ?? "",
      payment_type: PaymentType.boleto,
      reference_id: input.reference_id,
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
