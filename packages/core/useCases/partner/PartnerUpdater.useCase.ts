import { injectable } from "tsyringe";
import { UpdatePartnerRequest } from "./dtos/UpdatePartnerRequest.dto";
import { PartnerService } from "@core/services/partner.service";

@injectable()
export class PartnerUpdaterUseCase {
  constructor(private readonly partnerService: PartnerService) {}

  async execute(
    partnerId: number,
    input: UpdatePartnerRequest
  ): Promise<boolean> {
    return this.partnerService.update(partnerId, input);
  }
}
