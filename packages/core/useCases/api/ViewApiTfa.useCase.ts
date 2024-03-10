import { ApiService } from "@core/services/api.service";
import { injectable } from "tsyringe";
import { ViewApiTfaRequest } from "@core/useCases/api/dtos/ViewApiTfaRequest.dto";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";

@injectable()
export class ViewApiTfaUseCase {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async execute({ token }: ViewApiTfaRequest): Promise<ITokenTfaData | null> {
    return await this.apiService.findApiByTfa(token);
  }
}
