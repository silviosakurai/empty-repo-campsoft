import { PartnerService } from "@core/services/partner.service";
import { injectable } from "tsyringe";

@injectable()
export class PartnerDeleterUseCase {
  constructor(private readonly partnerService: PartnerService) {}

  async execute(partnerId: number): Promise<boolean> {
    return this.partnerService.delete(partnerId);
  }
}
