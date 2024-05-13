import { injectable } from "tsyringe";
import { ListPartnerResponse } from "@core/useCases/partner/dtos/ListPartnerResponse.dto";
import { ListPartnerRequest } from "./dtos/ListPartnerRequest.dto";
import { PartnerService } from "@core/services/partner.service";

@injectable()
export class PartnerListerUseCase {
  constructor(private readonly partnerService: PartnerService) {}

  async execute(
    query: ListPartnerRequest
  ): Promise<ListPartnerResponse | null> {
    return this.partnerService.list(query);
  }
}
