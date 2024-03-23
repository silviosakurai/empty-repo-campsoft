import { OrderService } from "@core/services/order.service";
import { injectable } from "tsyringe";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class ListOrdersUseCase {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  async execute(tokenKeyData: ITokenKeyData, tokenJwtData: ITokenJwtData) {
    return await this.orderService.listOrder(tokenKeyData, tokenJwtData);
  }
}
