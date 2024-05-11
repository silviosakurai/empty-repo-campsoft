import { PlanService, ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ProductViewResponse } from "./dtos/ProductResponse.dto";
import { ListPlanProductResponse } from "../plan/dtos/ListPlanResponse.dto";
import { MarketingService } from "@core/services/marketing.service";
import {
  MarketingProductHighlightsList,
  MarketingProductInstitucionalList,
  MarketingProductList,
  MarketingProductMagazinesList,
  MarketingProductSectionsList,
} from "@core/interfaces/repositories/marketing";
import { MarketingType } from "@core/common/enums/models/marketing";

@injectable()
export class ProductViewerUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly planService: PlanService,
    private readonly marketingService: MarketingService
  ) {}

  async execute(
    companyId: number,
    slug: string
  ): Promise<ProductViewResponse | null> {
    const product = await this.productService.view(companyId, slug);

    if (!product) {
      return null;
    }

    const [plansProduct, marketing] = await Promise.all([
      this.listPlansByProduct(companyId, product.product_id),
      this.marketingService.list(product.product_id),
    ]);

    return {
      ...product,
      plans: plansProduct,
      institutional: this.listMarketing(
        marketing,
        MarketingType.INSTITUTIONAL
      ) as MarketingProductInstitucionalList[],
      highlights: this.listMarketing(
        marketing,
        MarketingType.HIGHLIGHT
      ) as MarketingProductHighlightsList[],
      magazines: this.listMarketing(
        marketing,
        MarketingType.MAGAZINE
      ) as MarketingProductMagazinesList[],
      sections: this.listMarketing(
        marketing,
        MarketingType.SECTION
      ) as MarketingProductSectionsList[],
    };
  }

  async listPlansByProduct(companyId: number, productId: string) {
    const plansProduct = await this.planService.listPlansByProduct(
      companyId,
      productId
    );

    const planNames = plansProduct.map((plan) => plan.name);

    const formattedPlanNames =
      planNames.length > 1
        ? `${planNames.slice(0, -1).join(", ")} e ${planNames[planNames.length - 1]}.`
        : `${planNames[0]}.`;

    const lowestPrice = plansProduct.reduce((min, plan) => {
      return plan.low_price < min ? plan.low_price : min;
    }, Number.MAX_VALUE);

    return {
      plans_name: formattedPlanNames,
      low_price: lowestPrice,
    } as ListPlanProductResponse;
  }

  listMarketing(marketing: MarketingProductList[], type: MarketingType) {
    const formatMapping = {
      [MarketingType.HIGHLIGHT]: (item: MarketingProductList) =>
        ({
          title: item.titulo,
          subtitle: item.sub_titulo,
          description: item.descricao,
          image_background: item.url_imagem,
        }) as MarketingProductHighlightsList,

      [MarketingType.INSTITUTIONAL]: (item: MarketingProductList) =>
        ({
          title: item.titulo,
          description: item.descricao,
          image_background: item.url_imagem,
          video_url: item.url_video,
        }) as MarketingProductInstitucionalList,

      [MarketingType.MAGAZINE]: (item: MarketingProductList) =>
        ({
          title: item.titulo,
          image_background: item.url_imagem,
        }) as MarketingProductMagazinesList,

      [MarketingType.SECTION]: (item: MarketingProductList) =>
        ({
          title: item.titulo,
          image_background: item.url_imagem,
        }) as MarketingProductSectionsList,
    };

    const result = marketing
      .filter((item) => item.marketing_produto_tipo_id === type)
      .map((item) => (formatMapping[type] ? formatMapping[type](item) : null))
      .filter((item) => item !== null);

    return result;
  }
}
