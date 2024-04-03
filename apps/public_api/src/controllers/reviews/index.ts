import { injectable } from 'tsyringe';
import { listReviews } from './methods/listReviews';

@injectable()
export class ReviewsController {
  public list = listReviews;
}
export default ReviewsController;
