import { FindOrderByNumberRepository } from "@core/repositories/order/FindOrderByNumber.repository";
import { injectable } from "tsyringe";

@injectable()
export class OrderService {
  constructor(
    private readonly findOrderByNumberRepository: FindOrderByNumberRepository
  ) {}

  findOrderByNumber = async (orderNumber: string) => {
    try {
      return await this.findOrderByNumberRepository.find(orderNumber);
    } catch (error) {
      throw error;
    }
  };
}
