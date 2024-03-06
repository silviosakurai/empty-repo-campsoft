import { ViewClientRepository } from "@core/repositories/client/view.repository";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { injectable } from "tsyringe";

@injectable()
export class ClientService {
  private viewClientRepository: ViewClientRepository;

  constructor(viewClientRepository: ViewClientRepository) {
    this.viewClientRepository = viewClientRepository;
  }

  viewClient = async (apiAccess: ViewApiResponse, userId: string) => {
    try {
      return await this.viewClientRepository.view(apiAccess, userId);
    } catch (error) {
      throw error;
    }
  };
}
