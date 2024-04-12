import { injectable } from 'tsyringe';
import { createClientNewsletter } from './methods/createClientNewsletter';

@injectable()
export class NewsletterController {
  public create = createClientNewsletter;
}
export default NewsletterController;
