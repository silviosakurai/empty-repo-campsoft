import { ReviewService } from "@core/services/review.service";
import { injectable } from "tsyringe";
import { ReviewListerResponseDto } from "./dtos/ReviewListerResponse.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class ReviewsListerUseCase {
  constructor(private readonly reviewService: ReviewService) {}

  async list(keyApi: ITokenKeyData) {
    const results = await this.reviewService.list(keyApi);

    return results as ReviewListerResponseDto;
  }
}
