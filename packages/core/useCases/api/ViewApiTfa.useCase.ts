import { ApiService } from "@core/services/api.service";
import { injectable } from "tsyringe";
import { ViewApiTfaRequest } from "@core/useCases/api/dtos/ViewApiTfaRequest.dto";
import { ViewApiTfaResponse } from "@core/useCases/api/dtos/ViewApiTfaResponse.dto";

@injectable()
export class ViewApiTfaUseCase {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async execute({
    token,
  }: ViewApiTfaRequest): Promise<ViewApiTfaResponse | null> {
    return await this.apiService.findApiByTfa(token);
  }
}
