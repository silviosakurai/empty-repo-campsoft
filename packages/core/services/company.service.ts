import { injectable } from "tsyringe";
import { CompanyListerRepository } from "@core/repositories/company/CompanyLister.repository";

@injectable()
export class CompanyService {
  constructor(
    private readonly companyListerRepository: CompanyListerRepository
  ) {}

  list = async (clientId: string) => {
    return this.companyListerRepository.list(clientId);
  };
}
