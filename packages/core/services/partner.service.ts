import { injectable } from "tsyringe";
import { PartnerListerRepository } from "@core/repositories/partner/PartnerLister.repository";
import { ListPartnerRequest } from "@core/useCases/partner/dtos/ListPartnerRequest.dto";
import { PartnerCreatorRepository } from "@core/repositories/partner/PartnerCreator.repository";
import { PartnerUpdaterRepository } from "@core/repositories/partner/PartnerUpdater.repository";
import { PartnerDeleterRepository } from "@core/repositories/partner/PartnerDeleter.repository";
import { CreatePartnerRequest } from "@core/useCases/partner/dtos/CreatePartnerRequest.dto";
import { UpdatePartnerRequest } from "@core/useCases/partner/dtos/UpdatePartnerRequest.dto";

@injectable()
export class PartnerService {
  constructor(
    private readonly partnerListerRepository: PartnerListerRepository,
    private readonly partnerCreatorRepository: PartnerCreatorRepository,
    private readonly partnerUpdaterRepository: PartnerUpdaterRepository,
    private readonly partnerDeleterRepository: PartnerDeleterRepository,
  ) {}

  list = async (query: ListPartnerRequest) => {
    return this.partnerListerRepository.list(query);
  };

  create = async (input: CreatePartnerRequest) => {
    return this.partnerCreatorRepository.create(input);
  };

  update = async (partnerId: number, input: UpdatePartnerRequest) => {
    return this.partnerUpdaterRepository.update(partnerId, input);
  };

  delete = async (partnerId: number) => {
    return this.partnerDeleterRepository.delete(partnerId);
  };
}
