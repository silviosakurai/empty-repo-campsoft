import { injectable } from "tsyringe";
import { CreatePartnerRequest } from "./dtos/CreatePartnerRequest.dto";
import { PartnerService } from "@core/services/partner.service";

@injectable()
export class PartnerCreatorUseCase {
  constructor(private readonly partnerService: PartnerService) {}

  async execute(body: CreatePartnerRequest): Promise<boolean> {
    return this.partnerService.create(body);
  }
}
