import { ApiService } from "@core/services/api.service";
import { injectable } from "tsyringe";
import { ViewApiKeyRequest } from "@core/useCases/api/dtos/ViewApiKeyRequest.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class ApiKeyViewerUseCase {
  constructor(private readonly apiService: ApiService) {}

  async execute({
    keyApi,
    routePath,
    routeMethod,
    routeModule,
  }: ViewApiKeyRequest): Promise<ITokenKeyData | null> {
    return this.apiService.findApiByKey(
      keyApi,
      routePath,
      routeMethod,
      routeModule
    );
  }
}
