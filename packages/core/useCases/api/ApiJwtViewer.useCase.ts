import { ApiService } from "@core/services/api.service";
import { injectable } from "tsyringe";
import { ViewApiJwtRequest } from "@core/useCases/api/dtos/ViewApiJwtRequest.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class ApiJwtViewerUseCase {
  constructor(private readonly apiService: ApiService) {}

  async execute({
    clientId,
    tokenKeyData,
    routePath,
    routeMethod,
    routeModule,
  }: ViewApiJwtRequest): Promise<ITokenJwtData | null> {
    return await this.apiService.findApiByJwt(
      clientId,
      tokenKeyData,
      routePath,
      routeMethod,
      routeModule
    );
  }
}
