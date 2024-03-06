import { ApiService } from "@core/services/api.service";
import { injectable } from "tsyringe";
import { ViewApiKeyRequest } from "@core/useCases/api/dtos/ViewApiKeyRequest.dto";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

@injectable()
export class ViewApiKeyUseCase {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async execute({
    keyApi,
    routePath,
    routeMethod,
    routeModule,
  }: ViewApiKeyRequest): Promise<ViewApiResponse | null> {
    return this.apiService.findApiByKey(
      keyApi,
      routePath,
      routeMethod,
      routeModule
    );
  }
}
