import { OrderService } from "@core/services/order.service";
import { injectable } from "tsyringe";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ListOrderResponseWithCurrence } from "@core/useCases/order/dtos/ListOrderResponse.dto";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";

@injectable()
export class OrdersListerUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<ListOrderResponseWithCurrence[]> {
    const [results] = await Promise.all([
      this.orderService.listWithRecurrence(tokenKeyData, tokenJwtData),
    ]);

    if (!results.length) {
      return [];
    }
    console.log(results);
    return results;
  }

  private emptyResult(input: ListOrderRequestDto) {
    return {
      paging: {
        total: 0,
        current_page: input.current_page,
        per_page: input.per_page,
        count: 0,
        total_pages: 0,
      },
      results: [],
    };
  }
}
