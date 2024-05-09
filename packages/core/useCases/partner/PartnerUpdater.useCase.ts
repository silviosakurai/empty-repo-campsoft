import { injectable } from "tsyringe";
import { PartnerService } from "@core/services";
import { UpdatePartnerRequest } from "./dtos/UpdatePartnerRequest.dto";

@injectable()
export class PartnerUpdaterUseCase {
  constructor(private readonly partnerService: PartnerService) {}

  async execute(
    partnerId: number,
    input: UpdatePartnerRequest,
  ): Promise<boolean> {
    return this.partnerService.update(partnerId, input);
  }
}
