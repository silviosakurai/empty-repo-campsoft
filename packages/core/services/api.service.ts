import { RouteMethod, RouteModule } from "@core/common/enums/models/route";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
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
    routePath: string,
    routeMethod: RouteMethod,
    routeModule: RouteModule
  ): Promise<ITokenJwtData | null> => {
    return this.apiRepository.findApiByJwt(
      clientId,
      routePath,
      routeMethod,
      routeModule
    );
  };

  findApiByTfa = async (token: string) => {
    return this.apiRepository.findApiByTfa(token);
  };
}
