import { ApiService } from "@core/services/api.service";
import { injectable } from "tsyringe";
import { ViewApiKeyRequest } from "@core/useCases/api/dtos/ViewApiKeyRequest.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

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
  }: ViewApiKeyRequest): Promise<ITokenKeyData | null> {
    return await this.apiService.findApiByKey(
      keyApi,
      routePath,
      routeMethod,
      routeModule
    );
  }
}
