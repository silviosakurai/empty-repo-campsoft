import { injectable } from "tsyringe";
import { ListOrdersRepository } from "@core/repositories/order/ListOrders.repository";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";
import { ListPaymentRepository } from "@core/repositories/order/ListPayments.repository";
import { FindOrderByNumberRepository } from "@core/repositories/order/FindOrderByNumber.repository";

@injectable()
export class OrderService {
  constructor(
    private readonly ordersListerRepository: ListOrdersRepository,
    private readonly paymentListerRepository: ListPaymentRepository,
    private readonly orderByNumberViewerRepository: FindOrderByNumberRepository
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
      return await this.orderByNumberViewerRepository.find(
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
