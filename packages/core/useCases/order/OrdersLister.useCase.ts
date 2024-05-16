import { OrderService } from "@core/services/order.service";
import { injectable } from "tsyringe";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ListOrderWithCurrenceResponse } from "@core/useCases/order/dtos/ListOrderResponse.dto";

@injectable()
export class OrdersListerUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<ListOrderWithCurrenceResponse[]> {
    const results = await this.orderService.listWithRecurrence(
      tokenKeyData,
      tokenJwtData
    );

    if (!results.length) {
      return [];
    }
    return results;
  }
}
