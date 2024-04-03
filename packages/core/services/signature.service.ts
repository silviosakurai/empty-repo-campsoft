import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { SignatureByClientIdViewer } from "@core/repositories/signature/SignatureByClientIdViewer.repository";
import { CancelProductSignatureRepository } from "@core/repositories/signature/CancelProductSignature.repository";
import { CancelSignatureRepository } from "@core/repositories/signature/CancelSignature.repository";
import { FindSignatureByOrderNumber } from "@core/repositories/signature/FindSignatureByOrder.repository";
import { injectable } from "tsyringe";

@injectable()
export class SignatureService {
  constructor(
    private readonly signatureViewerByClientId: SignatureByClientIdViewer,
    private findSignatureByOrderNumber: FindSignatureByOrderNumber,
    private cancelSignatureRepository: CancelSignatureRepository,
    private cancelProductSignatureRepository: CancelProductSignatureRepository,
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
    tokenJwtData: ITokenJwtData,
  ) => {
    return this.cancelSignatureRepository.cancel(orderNumber, tokenKeyData, tokenJwtData);
  };

  cancelProducts = async (
    signatureId: string,
    productsIds: string[],
  ) => {
    return this.cancelProductSignatureRepository.cancel(signatureId, productsIds);
  }
}
