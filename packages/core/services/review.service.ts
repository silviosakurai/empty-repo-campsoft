import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ReviewListerRepository } from "@core/repositories/review/ReviewLister.repository";
import { injectable } from "tsyringe";

@injectable()
export class ReviewService {
  constructor(
    private readonly reviewListerRepository: ReviewListerRepository
  ) {}

  async list({ id_parceiro }: ITokenKeyData) {
    return this.reviewListerRepository.list(id_parceiro);
  }

  async listReviewByProductId(productId: string) {
    return this.reviewListerRepository.listReviewByProductId(productId);
  }
}
