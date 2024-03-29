import { OrderService } from "@core/services/order.service";
import { injectable } from "tsyringe";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ListOrderResponseDto } from "@core/useCases/order/dtos/ListOrderResponse.dto";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";

@injectable()
export class ListOrdersUseCase {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  async execute(
    input: ListOrderRequestDto,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<ListOrderResponseDto> {
    const [results, count] = await Promise.all([
      this.orderService.listOrder(input, tokenKeyData, tokenJwtData),
      this.orderService.countTotal(tokenKeyData, tokenJwtData),
    ]);

    if (!results.length) {
      return this.emptyResult(input);
    }

    const totalPages = Math.ceil(count / input.per_page);

    return {
      paging: {
        total: count,
        current_page: input.current_page,
        per_page: input.per_page,
        count: results.length,
        total_pages: totalPages,
      },
      results: results,
    };
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
