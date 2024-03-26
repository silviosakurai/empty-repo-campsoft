import { OrderService } from "@core/services/order.service";
import { injectable } from "tsyringe";
import { FindOrderByNumberResponse } from "./dtos/FindOrderByNumberResponse.dto";
import { OrderByNumberResponse } from "@core/interfaces/repositories/order";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class FindOrderByNumberUseCase {
  constructor(private readonly orderService: OrderService) {}

  async find(
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) {
    const result = await this.orderService.findOrderByNumber(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );

    if (!result) {
      return null;
    }

    const recordsFormatted = this.calculatePrices(result);

    return recordsFormatted;
  }

  private calculatePrices(
    order: OrderByNumberResponse
  ): FindOrderByNumberResponse {
    return {
      ...order,
      totals: {
        subtotal_price: order.totals.subtotal_price,
        discount_item_value: order.totals.discount_item_value,
        discount_coupon_value: order.totals.discount_coupon_value,
        discount_percentage: order.totals.discount_percentage,
        total: order.totals.total,
        installments: {
          installment: order.totals.installment,
          value: order.totals.value,
        },
      },
    };
  }
}
