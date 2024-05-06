import { WebhookTypeEnum } from "@core/common/enums/Webhook";
import { injectable } from "tsyringe";
import { SignatureActivatorByTransactionIdUseCase } from "../signature/SignatureActivatorByTransactionId.useCase";
import { PaymentWebhookHandlerRequest } from "./dtos/WebhookRequest.dto";

@injectable()
export class PaymentWebhookHandlerUseCase {
  constructor(
    private readonly signatureActivatorByTransactionIdUseCase: SignatureActivatorByTransactionIdUseCase
  ) {}

  async handle<T extends PaymentWebhookHandlerRequest>(input: T) {
    if (input.type === WebhookTypeEnum.TRANSACTION_SUCCEEDED) {
      return await this.signatureActivatorByTransactionIdUseCase.active(
        input.payload.id
      );
    }
  }
}
