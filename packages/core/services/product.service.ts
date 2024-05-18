import { injectable } from "tsyringe";
import {
  ListAllProductRequest,
  ListProductRequest,
} from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ProductListerRepository } from "@core/repositories/product/ProductLister.repository";
import { ProductViewerRepository } from "@core/repositories/product/ProductViewer.repository";
import { CrossSellProductListerRepository } from "@core/repositories/product/CrossSellProductLister.repository";
import { CrossSellProductRequest } from "@core/useCases/product/dtos/ListCrossSellProductRequest.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { CreateProductRequest } from "@core/useCases/product/dtos/CreateProductRequest.dto";
import { ProductCreatorRepository } from "@core/repositories/product/ProductCreator.repository";
import { ProductListerGroupedByCompanyRepository } from "@core/repositories/product/ProductListerGroupedByCompany.repository";
import { ProductPartnerCreatorRepository } from "@core/repositories/product/ProductPartnerCreator.repository";
import { ProductDetailHowToAccessUpdaterRepository } from "@core/repositories/product/ProductDetailHowToAccessUpdater.repository";
import { UpdateParams } from "@core/useCases/product/dtos/ProductDetaiHowToAccess.dto";
import { ProductViewerGroupedByCompanyRepository } from "@core/repositories/product/ProductViewerGroupedByCompany.repository";
import { ProductUpdaterRepository } from "@core/repositories/product/ProductUpdater.repository";
import { UpdateProductRequest } from "@core/useCases/product/dtos/UpdateProductRequest.dto";
import { ProductCompanyViewerRepository } from "@core/repositories/product/ProductCompanyViewer.repository";
import { ProductImagesUrlUpdaterRepository } from "@core/repositories/product/ProductImagesUrlUpdater.repository";
import { ProductImageRepositoryCreateInput } from "@core/interfaces/repositories/products";
import { ProductGroupViewerRepository } from "@core/repositories/product/ProductGroupViewer.repository";
import { ProductGroupProductCreatorRepository } from "@core/repositories/product/ProductGroupProductCreator.repository";
import { ProductGroupProductDeleterRepository } from "@core/repositories/product/ProductGroupProductDeleter.repository";
import { ProductGroupProductViewerRepository } from "@core/repositories/product/ProductGroupProductViewer.repository";
import { ProductGroupImagesUrlUpdaterRepository } from "@core/repositories/product/ProductGroupImagesUrlUpdater.repository";
import { ProductGroupProductListerRepository } from "@core/repositories/product/ProductGroupProductLister.repository";
import { ProductGroupUpdaterRepository } from "@core/repositories/product/ProductGroupUpdater.repository";
import { UpdateProductGroupBodyRequest } from "@core/useCases/product/dtos/UpdateProductGroupRequest.dto";
import { ListProductByCompanyRequest } from "@core/useCases/product/dtos/ListProductByCompanyRequest.dto";
import { ProductGroupCreatorRepository } from "@core/repositories/product/ProductGroupCreator.repository";
import { ProductGroupListerRepository } from "@core/repositories/product/ProductGroupLister.repository";
import { ProductPartnerDeleterRepository } from "@core/repositories/product/ProductPartnerDeleter.repository";
import { ProductPartnerViewerRepository } from "@core/repositories/product/ProductPartnerViewer.repository";
import { ProductListerNoPaginationRepository } from "@core/repositories/product/ProductListerNoPaginationRepository.repository";
import { ProductListerNoPaginationUserLoggedRepository } from "@core/repositories/product/ProductListerNoPaginationUserLogged.repository";
import { CreateCartRequest } from "@core/useCases/cart/dtos/CreateCartRequest.dto";
import { ProductListerByCartRepository } from "@core/repositories/product/ProductListerByCart.repository";

@injectable()
export class ProductService {
  constructor(
    private readonly productViewerRepository: ProductViewerRepository,
    private readonly productViewerGroupedByCompanyRepository: ProductViewerGroupedByCompanyRepository,
    private readonly productCreatorRepository: ProductCreatorRepository,
    private readonly productUpdaterRepository: ProductUpdaterRepository,
    private readonly imagesUrlUpdaterRepository: ProductImagesUrlUpdaterRepository,
    private readonly productCompanyViewerRepository: ProductCompanyViewerRepository,
    private readonly productPartnerViewerRepository: ProductPartnerViewerRepository,
    private readonly productPartnerCreatorRepository: ProductPartnerCreatorRepository,
    private readonly productPartnerDeleterRepository: ProductPartnerDeleterRepository,
    private readonly productListerRepository: ProductListerRepository,
    private readonly productListerGroupedByCompanyRepository: ProductListerGroupedByCompanyRepository,
    private readonly productDetailHowToAccessUpdaterRepository: ProductDetailHowToAccessUpdaterRepository,
    private readonly crossSellProductListerRepository: CrossSellProductListerRepository,
    private readonly productGroupViewerRepository: ProductGroupViewerRepository,
    private readonly productGroupUpdaterRepository: ProductGroupUpdaterRepository,
    private readonly productGroupProductViewerRepository: ProductGroupProductViewerRepository,
    private readonly productGroupProductListerRepository: ProductGroupProductListerRepository,
    private readonly productGroupProductCreatorRepository: ProductGroupProductCreatorRepository,
    private readonly productDeleterFromGroupRepository: ProductGroupProductDeleterRepository,
    private readonly productGroupImagesUrlUpdaterRepository: ProductGroupImagesUrlUpdaterRepository,
    private readonly productGroupCreatorRepository: ProductGroupCreatorRepository,
    private readonly ProductGroupListerRepository: ProductGroupListerRepository,
    private readonly productListerNoPaginationRepository: ProductListerNoPaginationRepository,
    private readonly productListerNoPaginationUserLoggedRepository: ProductListerNoPaginationUserLoggedRepository,
    private readonly productListerByCartRepository: ProductListerByCartRepository
  ) {}

  create = async (input: CreateProductRequest) => {
    return this.productCreatorRepository.create(input);
  };

  viewProductPartner = async (productId: string, partnerId: number) => {
    return this.productPartnerViewerRepository.view(productId, partnerId);
  };

  createProductPartner = async (productId: string, partnerId: number) => {
    return this.productPartnerCreatorRepository.create(productId, partnerId);
  };

  deleteProductPartner = async (productId: string, partnerId: number) => {
    return this.productPartnerDeleterRepository.delete(productId, partnerId);
  };

  list = async (companyId: number, query: ListProductRequest) => {
    return this.productListerRepository.list(companyId, query);
  };

  listNoPagination = async (
    companyId: number,
    query: ListAllProductRequest
  ) => {
    return this.productListerNoPaginationRepository.list(companyId, query);
  };
  listNoPaginationUserLogged = async (
    productIds: string[],
    query: ListAllProductRequest
  ) => {
    return this.productListerNoPaginationUserLoggedRepository.list(
      productIds,
      query
    );
  };

  listByCompanyIds = async (
    query: ListProductByCompanyRequest,
    listPartnersIds: number[]
  ) => {
    return this.productListerGroupedByCompanyRepository.list(
      query,
      listPartnersIds
    );
  };

  countTotalCompanies = async (
    query: ListProductByCompanyRequest,
    listPartnersIds: number[]
  ) => {
    return this.productListerGroupedByCompanyRepository.countTotalCompanies(
      query,
      listPartnersIds
    );
  };

  listByIds = async (companyId: number, productIds: string[]) => {
    return this.productListerRepository.listByIds(companyId, productIds);
  };

  view = async (companyId: number, slug: string) => {
    return this.productViewerRepository.get(companyId, slug);
  };

  viewByCompanyIds = async (partnerIds: number[], sku: string) => {
    return this.productViewerGroupedByCompanyRepository.view(partnerIds, sku);
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
    payload: CreateCartRequest
  ): Promise<boolean> => {
    const selectedProducts = payload.products ?? [];

    if (selectedProducts.length === 0) {
      return true;
    }

    const planProductCrossSell = await this.findPlanProductCrossSell(
      tokenKeyData,
      payload.plan.plan_id,
      payload.months ?? 0,
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

  updateDetailHowToAccess = async (
    productId: string,
    updateParams: UpdateParams
  ) => {
    return this.productDetailHowToAccessUpdaterRepository.updateDetailHowToAccess(
      productId,
      updateParams
    );
  };

  deleteDetailHowToAccess = async (
    productId: string,
    updateParams: UpdateParams
  ) => {
    return this.productDetailHowToAccessUpdaterRepository.updateDetailHowToAccess(
      productId,
      updateParams
    );
  };

  update = async (productId: string, input: UpdateProductRequest) => {
    return this.productUpdaterRepository.update(productId, input);
  };

  productCompanyViewer(productId: string, listPartnersIds: number[]) {
    return this.productCompanyViewerRepository.view(productId, listPartnersIds);
  }

  updateImagesUrl(productId: string, input: ProductImageRepositoryCreateInput) {
    return this.imagesUrlUpdaterRepository.update(productId, input);
  }

  findGroup(groupId: number) {
    return this.productGroupViewerRepository.get(groupId);
  }

  updateGroup = async (
    groupId: number,
    input: UpdateProductGroupBodyRequest
  ) => {
    return this.productGroupUpdaterRepository.update(groupId, input);
  };

  findProductGroupProduct(groupId: number, productId: string) {
    return this.productGroupProductViewerRepository.view(groupId, productId);
  }

  listProductGroupProduct(groupId: number) {
    return this.productGroupProductListerRepository.list(groupId);
  }

  addProductToGroup(groupId: number, productId: string) {
    return this.productGroupProductCreatorRepository.create(groupId, productId);
  }

  deleteProductFromGroup(groupId: number, productId: string) {
    return this.productDeleterFromGroupRepository.delete(groupId, productId);
  }

  updateGroupsImagesUrl(groupId: number, url: string) {
    return this.productGroupImagesUrlUpdaterRepository.update(groupId, url);
  }

  createProductGroup(name: string, choices: number) {
    return this.productGroupCreatorRepository.create(name, choices);
  }

  listProductGroup() {
    return this.ProductGroupListerRepository.list();
  }

  listByIdsCart = async (productIds: string[]) => {
    return this.productListerByCartRepository.listByIds(productIds);
  };
}
