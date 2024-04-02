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
    return this.apiRepository.findApiByKey(
      keyApi,
      routePath,
      routeMethod,
      routeModule
    );
  };

  findApiByJwt = async (
    clientId: string,
    tokenKeyData: ITokenKeyData,
    routePath: string,
    routeMethod: RouteMethod,
    routeModule: RouteModule
  ) => {
    return this.apiRepository.findApiByJwt(
      clientId,
      tokenKeyData,
      routePath,
      routeMethod,
      routeModule
    );
  };

  findApiByTfa = async (token: string) => {
    return this.apiRepository.findApiByTfa(token);
  };
}
