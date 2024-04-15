import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ProductListerRepository } from "@core/repositories/product/ProductLister.repository";
import { ProductViewerRepository } from "@core/repositories/product/ProductViewer.repository";
import { CrossSellProductListerRepository } from "@core/repositories/product/CrossSellProductLister.repository";
import { CrossSellProductRequest } from "@core/useCases/product/dtos/ListCrossSellProductRequest.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { CreateProductRequest } from "@core/useCases/product/dtos/CreateProductRequest.dto";
import { ProductCreatorRepository } from "@core/repositories/product/ProductCreator.repository";
import { ProductListerGroupedByCompanyRepository } from "@core/repositories/product/ProductListerGroupedByCompany.repository";
import { ProductCompanyCreatorRepository } from "@core/repositories/product/ProductCompanyCreator.repository";
import { ProductUpdaterRepository } from "@core/repositories/product/ProductUpdater.repository";
import { UpdateProductRequest } from "@core/useCases/product/dtos/UpdateProductRequest.dto";
import { ProductCompanyViewerRepository } from "@core/repositories/product/ProductCompanyViewer.repository";
import { ProductImagesUrlUpdaterRepository } from "@core/repositories/product/ProductImagesUrlUpdater.repository";
import { ProductImageRepositoryCreateInput } from "@core/interfaces/repositories/products";

@injectable()
export class ProductService {
  constructor(
    private readonly productViewerRepository: ProductViewerRepository,
    private readonly productListerRepository: ProductListerRepository,
    private readonly productCreatorRepository: ProductCreatorRepository,
    private readonly productUpdaterRepository: ProductUpdaterRepository,
    private readonly imagesUrlUpdaterRepository: ProductImagesUrlUpdaterRepository,
    private readonly productCompanyViewerRepository: ProductCompanyViewerRepository,
    private readonly productCompanyCreatorRepository: ProductCompanyCreatorRepository,
    private readonly crossSellProductListerRepository: CrossSellProductListerRepository,
    private readonly productListerGroupedByCompanyRepository: ProductListerGroupedByCompanyRepository
  ) {}

  create = async (input: CreateProductRequest) => {
    return this.productCreatorRepository.create(input);
  };

  createProductCompany = async (productId: string, companyId: number) => {
    return this.productCompanyCreatorRepository.create(productId, companyId);
  };

  list = async (companyId: number, query: ListProductRequest) => {
    return this.productListerRepository.list(companyId, query);
  };

  listByCompanyIds = async (
    companyIds: number[],
    query: ListProductRequest
  ) => {
    return this.productListerGroupedByCompanyRepository.list(companyIds, query);
  };

  listByIds = async (companyId: number, productIds: string[]) => {
    return this.productListerRepository.listByIds(companyId, productIds);
  };

  view = async (companyId: number, sku: string) => {
    return this.productViewerRepository.get(companyId, sku);
  };

  findProductsByIds = async (companyId: number, productIds: string[]) => {
    return this.productListerRepository.listByIds(companyId, productIds);
  };

  listCrossSell = async (input: CrossSellProductRequest) => {
    return this.crossSellProductListerRepository.list(input);
  };

  findPlanProductCrossSell = async (
    tokenKeyData: ITokenKeyData,
    planId: number,
    months: number,
    selectedProducts: string[]
  ) => {
    return this.crossSellProductListerRepository.findPlanProductCrossSell(
      tokenKeyData,
      planId,
      months,
      selectedProducts
    );
  };

  findPlanPriceProductCrossSell = async (
    tokenKeyData: ITokenKeyData,
    planId: number,
    months: number,
    selectedProducts: string[]
  ) => {
    return this.crossSellProductListerRepository.findPlanPriceProductCrossSell(
      tokenKeyData,
      planId,
      months,
      selectedProducts
    );
  };

  isPlanProductCrossSell = async (
    tokenKeyData: ITokenKeyData,
    payload: CreateOrderRequestDto
  ): Promise<boolean> => {
    const selectedProducts = payload.products ?? [];

    if (selectedProducts.length === 0) {
      return true;
    }

    const planProductCrossSell = await this.findPlanProductCrossSell(
      tokenKeyData,
      payload.plan.plan_id,
      payload.months,
      selectedProducts
    );

    if (!planProductCrossSell || planProductCrossSell.length === 0) {
      return false;
    }

    const productIds = planProductCrossSell.map((item) =>
      item.product_id.toString()
    );

    const allProductsSelected = selectedProducts.every((selected) =>
      productIds.includes(selected.toString())
    );

    return allProductsSelected;
  };

  update = async (productId: string, input: UpdateProductRequest) => {
    return this.productUpdaterRepository.update(productId, input);
  };

  productCompanyViewer(productId: string, companyId: number) {
    return this.productCompanyViewerRepository.view(productId, companyId);
  }

  updateImagesUrl(productId: string, input: ProductImageRepositoryCreateInput) {
    return this.imagesUrlUpdaterRepository.update(productId, input);
  }
}
