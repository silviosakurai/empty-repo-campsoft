import { ApiService } from "@core/services/api.service";
import { injectable } from "tsyringe";
import { ViewApiRequest } from "@core/useCases/api/dtos/ViewApiRequest.dto";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

@injectable()
export class ViewApiUseCase {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async execute({ keyApi }: ViewApiRequest): Promise<ViewApiResponse | null> {
    return this.apiService.viewApi(keyApi);
  }
}
