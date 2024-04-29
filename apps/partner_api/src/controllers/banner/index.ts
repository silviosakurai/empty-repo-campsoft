import { injectable } from 'tsyringe';
import { listBanner } from './methods/listBanner';
import { viewBanner } from './methods/viewBanner';
import { createBanner } from './methods/createBanner';
import { createBannerItem } from './methods/createBannerItem';
import { updateBanner } from './methods/updateBanner';
import { updateBannerItem } from './methods/updateBannerItem';
import { deleteBanner } from './methods/deleteBanner';
import { deleteBannerItem } from './methods/deleteBannerItem';
import { uploadBannerImage } from './methods/uploadBannerImage';

@injectable()
class BannerController {
  public list = listBanner;
  public view = viewBanner;
  public create = createBanner;
  public createItem = createBannerItem;
  public update = updateBanner;
  public updateItem = updateBannerItem;
  public delete = deleteBanner;
  public deleteItem = deleteBannerItem;
  public uploadBannerImage = uploadBannerImage;
}

export default BannerController;
