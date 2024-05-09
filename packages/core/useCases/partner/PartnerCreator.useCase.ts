import { injectable } from "tsyringe";
import { PartnerService } from "@core/services";
import { CreatePartnerRequest } from "./dtos/CreatePartnerRequest.dto";

@injectable()
export class PartnerCreatorUseCase {
  constructor(private readonly partnerService: PartnerService) {}

  async execute(
    body: CreatePartnerRequest
  ): Promise<boolean> {
    return this.partnerService.create(body);
  }
}
