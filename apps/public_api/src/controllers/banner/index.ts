import { injectable } from 'tsyringe';
import { readBanner } from './methods/readBanner';

@injectable()
class BannerController {
  public read = readBanner;
}
export default BannerController;
