import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ReviewListerRepository } from "@core/repositories/review/ReviewLister.repository";
import { injectable } from "tsyringe";

@injectable()
export class ReviewService {
  constructor(
    private readonly reviewListerRepository: ReviewListerRepository,
  ) {}

  async list({ company_id }: ITokenKeyData) {
    return this.reviewListerRepository.list(company_id);
  }
}
