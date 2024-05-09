import { OrderService } from "@core/services";
import { SignatureService } from "@core/services/signature.service";
import { injectable } from "tsyringe";

@injectable()
export class SignatureActivatorByTransactionIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly signatureService: SignatureService
  ) {}

  async active(transactionId: string) {
    const order = await this.orderService.viewByTransactionId(transactionId);

    if (!order) {
      return false;
    }

    await this.signatureService.activePaidSignature(
      order.order_id,
      order.previousOrderId,
      true
    );

    return order;
  }
}
