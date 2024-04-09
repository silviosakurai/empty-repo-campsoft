import { injectable } from 'tsyringe';
import { viewClientNewsletter } from './methods/viewClientNewsletter';
import { createClientNewsletter } from './methods/createClientNewsletter';

@injectable()
export class NewsletterController {
  public view = viewClientNewsletter;
  public create = createClientNewsletter;
}
export default NewsletterController;
