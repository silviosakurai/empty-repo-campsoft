import { RouteMethod, RouteModule } from "@core/common/enums/models/route";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ApiRepository } from "@core/repositories/api/Api.repository";
import { injectable } from "tsyringe";

@injectable()
export class ApiService {
  constructor(private readonly apiRepository: ApiRepository) {}

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
    tokenKeyData: ITokenKeyData,
    routePath: string,
    routeMethod: RouteMethod,
    routeModule: RouteModule
  ) => {
    try {
      return await this.apiRepository.findApiByJwt(
        clientId,
        tokenKeyData,
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
