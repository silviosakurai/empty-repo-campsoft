import { ApiService } from "@core/services/api.service";
import { injectable } from "tsyringe";
import { ViewApiJwtRequest } from "@core/useCases/api/dtos/ViewApiJwtRequest.dto";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

@injectable()
export class ViewApiJwtUseCase {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async execute({
    clientId,
    apiAccess,
    routePath,
    routeMethod,
    routeModule,
  }: ViewApiJwtRequest): Promise<boolean> {
    return this.apiService.findApiByJwt(
      clientId,
      apiAccess,
      routePath,
      routeMethod,
      routeModule
    );
  }
}
