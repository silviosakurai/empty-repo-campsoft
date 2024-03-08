import { RouteMethod, RouteModule } from "@core/common/enums/models/route";
import { ApiRepository } from "@core/repositories/api/Api.repository";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { injectable } from "tsyringe";

@injectable()
export class ApiService {
  private apiRepository: ApiRepository;

  constructor(apiRepository: ApiRepository) {
    this.apiRepository = apiRepository;
  }

  findApiByKey = async (
    keyApi: string,
    routePath: string,
    routeMethod: RouteMethod,
    routeModule: RouteModule
  ) => {
    try {
      return await this.apiRepository.findApiByKey(
        keyApi,
        routePath,
        routeMethod,
        routeModule
      );
    } catch (error) {
      throw error;
    }
  };

  findApiByJwt = async (
    clientId: string,
    apiAccess: ViewApiResponse,
    routePath: string,
    routeMethod: RouteMethod,
    routeModule: RouteModule
  ) => {
    try {
      return await this.apiRepository.findApiByJwt(
        clientId,
        apiAccess,
        routePath,
        routeMethod,
        routeModule
      );
    } catch (error) {
      throw error;
    }
  };

  findApiByTfa = async (token: string) => {
    try {
      return await this.apiRepository.findApiByTfa(token);
    } catch (error) {
      throw error;
    }
  };
}
