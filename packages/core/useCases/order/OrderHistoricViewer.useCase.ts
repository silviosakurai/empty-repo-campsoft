import { OrderService } from "@core/services/order.service";
import { injectable } from "tsyringe";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { OrderHistoricViewerResponseDto } from "@core/useCases/order/dtos/ViewOrderPaymentHistoric.dto";
import { ViewOrderPaymentHistoricRequest } from "@core/useCases/order/dtos/ViewOrderPaymentHistoricRequest.dto";

@injectable()
export class OrderHistoricUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(
    orderNumber: ViewOrderPaymentHistoricRequest,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) {
    const [results] = await Promise.all([
      this.orderService.viewPaymentHistoric(
        orderNumber,
        tokenKeyData,
        tokenJwtData
      ),
    ]);

    return results;
  }
}
