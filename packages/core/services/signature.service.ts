import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { SignatureByClientIdViewer } from "@core/repositories/signature/SignatureByClientIdViewer.repository";
import { CancelProductSignatureRepository } from "@core/repositories/signature/CancelProductSignature.repository";
import { CancelSignatureRepository } from "@core/repositories/signature/CancelSignature.repository";
import { FindSignatureByOrderNumber } from "@core/repositories/signature/FindSignatureByOrder.repository";
import { injectable } from "tsyringe";
import { SignatureCreatorRepository } from "@core/repositories/signature/SignatureCreator.repository";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";

@injectable()
export class SignatureService {
  constructor(
    private readonly signatureViewerByClientId: SignatureByClientIdViewer,
    private findSignatureByOrderNumber: FindSignatureByOrderNumber,
    private cancelSignatureRepository: CancelSignatureRepository,
    private cancelProductSignatureRepository: CancelProductSignatureRepository,
    private signatureCreatorRepository: SignatureCreatorRepository
  ) {}

  findByClientId = async (client_id: string) => {
    return this.signatureViewerByClientId.find(client_id);
  };

  findByOrderNumber = async (orderNumber: string) => {
    return this.findSignatureByOrderNumber.find(orderNumber);
  };

  cancelByOrderNumber = async (
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) => {
    return this.cancelSignatureRepository.cancel(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );
  };

  cancelProducts = async (
    signatureId: string,
    productCancelDate: string,
    productsIds: string[]
  ) => {
    return this.cancelProductSignatureRepository.cancel(
      signatureId,
      productCancelDate,
      productsIds
    );
  };

  create = async (
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: CreateOrderRequestDto,
    orderId: string
  ) => {
    return this.signatureCreatorRepository.create(
      tokenKeyData,
      tokenJwtData,
      payload,
      orderId
    );
  };

  createSignatureProducts = async (products: string[], signatureId: string) => {
    return this.signatureCreatorRepository.createSignatureProducts(
      products,
      signatureId
    );
  };
}
