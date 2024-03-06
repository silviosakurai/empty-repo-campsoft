import { ApiRepository } from "@core/repositories/api/api.repository";
import { injectable } from "tsyringe";

@injectable()
export class ApiService {
  private apiRepository: ApiRepository;

  constructor(apiRepository: ApiRepository) {
    this.apiRepository = apiRepository;
  }

  viewApi = async (keyApi: string) => {
    try {
      return await this.apiRepository.viewApi(keyApi);
    } catch (error) {
      throw error;
    }
  };
}
