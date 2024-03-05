import { ApiRepository } from "@core/repositories/api/api.repository";
import { injectable } from "tsyringe";

@injectable()
export class ApiService {
  private apiRepository: ApiRepository;

  constructor(apiRepository: ApiRepository) {
    this.apiRepository = apiRepository;
  }

  findApiByKey = async (keyApi: string) => {
    try {
      return await this.apiRepository.findApiByKey(keyApi);
    } catch (error) {
      throw error;
    }
  };

  findApiByJwt = async (clientId: string) => {
    try {
      return await this.apiRepository.findApiByJwt(clientId);
    } catch (error) {
      throw error;
    }
  };
}
