import { injectable } from "tsyringe";
import { PartnerService } from "@core/services";

@injectable()
export class PartnerDeleterUseCase {
  constructor(private readonly partnerService: PartnerService) {}

  async execute(
    partnerId: number,
  ): Promise<boolean> {
    return this.partnerService.delete(partnerId);
  }
}
