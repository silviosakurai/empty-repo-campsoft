import { OrderService } from "@core/services/order.service";
import { injectable } from "tsyringe";
import { FindOrderByNumberResponse } from "./dtos/FindOrderByNumberResponse.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class OrderByNumberViewerUseCase {
  constructor(private readonly orderService: OrderService) {}

  async find(
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<FindOrderByNumberResponse | null> {
    const result = await this.orderService.viewOrderByNumber(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );

    if (!result) {
      return null;
    }

    return result;
  }
}
