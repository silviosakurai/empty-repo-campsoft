import { OrderService } from "@core/services/order.service";
import { injectable } from "tsyringe";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { OrderHistoricResponse } from "@core/common/enums/models/order";
import { formatCode } from "@core/common/functions/formatCode";

@injectable()
export class OrderHistoricUseCase {
  constructor(private readonly orderService: OrderService) {}

  async execute(
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<OrderHistoricResponse[]> {
    const historicPayment = await this.orderService.viewPaymentHistoric(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );

    const mappedHistoricPayments = historicPayment.map((payment) => {
      return {
        ...payment,
        method: {
          ...payment.method,
          code: payment.method.code ? formatCode(payment.method.code) : null,
        },
      };
    });

    return mappedHistoricPayments;
  }
}
