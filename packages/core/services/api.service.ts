import { RouteMethod, RouteModule } from "@core/common/enums/models/route";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ApiRepository } from "@core/repositories/api/Api.repository";
import { injectable } from "tsyringe";

@injectable()
export class ApiService {
  constructor(private readonly apiRepository: ApiRepository) {}

  findApiByKey = async (keyApi: string, routeModule: RouteModule) => {
    return this.apiRepository.findApiByKey(keyApi, routeModule);
  };

  findApiByJwt = async (
    clientId: string,
    routeModule: RouteModule
  ): Promise<ITokenJwtData | null> => {
    return this.apiRepository.findApiByJwt(clientId, routeModule);
  };

  findApiByTfa = async (token: string) => {
    return this.apiRepository.findApiByTfa(token);
  };
}
