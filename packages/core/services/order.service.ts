import { injectable } from "tsyringe";
import { OrdersListerRepository } from "@core/repositories/order/OrdersLister.repository";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";
import { PaymentListerRepository } from "@core/repositories/order/PaymentsLister.repository";
import { OrderByNumberViewerRepository } from "@core/repositories/order/OrderByNumberViewer.repository";

@injectable()
export class OrderService {
  constructor(
    private readonly ordersListerRepository: OrdersListerRepository,
    private readonly paymentListerRepository: PaymentListerRepository,
    private readonly orderByNumberViewerRepository: OrderByNumberViewerRepository
  ) {}

  list = async (
    input: ListOrderRequestDto,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    try {
      return await this.ordersListerRepository.list(
        input,
        tokenKeyData,
        tokenJwtData
      );
    } catch (error) {
      throw error;
    }
  };

  countTotal = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    try {
      return await this.ordersListerRepository.countTotal(
        tokenKeyData,
        tokenJwtData
      );
    } catch (error) {
      throw error;
    }
  };

  viewOrderByNumber = async (
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    try {
      return await this.orderByNumberViewerRepository.view(
        orderNumber,
        tokenKeyData,
        tokenJwtData
      );
    } catch (error) {
      throw error;
    }
  };

  listPayment = async (orderId: string) => {
    try {
      return this.paymentListerRepository.list(orderId);
    } catch (error) {
      throw error;
    }
  };
}
