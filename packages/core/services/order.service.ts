import { injectable } from "tsyringe";
import { ListOrdersRepository } from "@core/repositories/order/ListOrders.repository";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";

@injectable()
export class OrderService {
  private listOrdersRepository: ListOrdersRepository;

  constructor(listOrdersRepository: ListOrdersRepository) {
    this.listOrdersRepository = listOrdersRepository;
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
}
