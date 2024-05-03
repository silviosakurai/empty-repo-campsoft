import { WebhookTypeEnum } from "@core/common/enums/Webhook";
import { ITransactionPixWebhookSuccessResponse } from "@core/interfaces/services/payment/ITransactionPix";
import { injectable } from "tsyringe";

@injectable()
export class PaymentWebhookHandlerUseCase {
  constructor() {}

  async handle<T extends PaymentWebhookHandlerRequest>(input: T) {
    switch (input.type) {
      case WebhookTypeEnum.TRANSACTION_SUCCEEDED:
        return;
    }
  }
}

type PaymentWebhookHandlerRequest = ITransactionPixWebhookSuccessResponse;
