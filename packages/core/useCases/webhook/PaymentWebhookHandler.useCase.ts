import { WebhookTypeEnum } from "@core/common/enums/Webhook";
import { injectable } from "tsyringe";
import { SignatureActivatorByTransactionIdUseCase } from "../signature/SignatureActivatorByTransactionId.useCase";
import { PaymentWebhookHandlerRequest } from "./dtos/WebhookRequest.dto";
import axios from "axios";
import { generalEnvironment } from "@core/config/environments";

@injectable()
export class PaymentWebhookHandlerUseCase {
  constructor(
    private readonly signatureActivatorByTransactionIdUseCase: SignatureActivatorByTransactionIdUseCase
  ) {}

  async handle<T extends PaymentWebhookHandlerRequest>(input: T) {
    if (input.type === WebhookTypeEnum.TRANSACTION_SUCCEEDED) {
      const result = await this.signatureActivatorByTransactionIdUseCase.active(
        input.payload.id
      );

      if (!result) return false;

      await axios.post(
        `${generalEnvironment.appUrlWebsocket}/payment/${result.order_id}`,
        {
          headers: {
            "User-Agent": "Mania de App (API)",
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    }
  }
}
