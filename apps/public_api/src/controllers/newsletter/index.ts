import { injectable } from 'tsyringe';
import { createNewsletter } from './methods/createNewsletter';
import { activateEmail } from './methods/activateEmail';

@injectable()
class NewsletterController {
  public createNewsletter = createNewsletter;
  public activateEmail = activateEmail;
}

export default NewsletterController;
