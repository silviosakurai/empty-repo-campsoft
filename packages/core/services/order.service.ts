import { injectable } from "tsyringe";
import { ListOrdersRepository } from "@core/repositories/order/ListOrders.repository";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";
import { ListPaymentRepository } from "@core/repositories/order/ListPayments.repository";

@injectable()
export class OrderService {
  private listOrdersRepository: ListOrdersRepository;
  private listPaymentRepository: ListPaymentRepository;

  constructor(
    listOrdersRepository: ListOrdersRepository,
    listPaymentRepository: ListPaymentRepository,
  ) {
    this.listOrdersRepository = listOrdersRepository;
    this.listPaymentRepository = listPaymentRepository;
  }

  listOrder = async (
    input: ListOrderRequestDto,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    try {
      return await this.listOrdersRepository.list(
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
      return await this.listOrdersRepository.countTotal(
        tokenKeyData,
        tokenJwtData
      );
    } catch (error) {
      throw error;
    }
  };

  findOrderByNumber = async (orderNumber: string) => {
    //
  };

  listPayment = async (orderId: string) => {
    try {
      return this.listPaymentRepository.list(orderId);
    } catch (error) {
      throw error;
    }
  };
}
