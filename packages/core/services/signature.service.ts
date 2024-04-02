import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { CancelProductSignatureRepository } from "@core/repositories/signature/CancelProductSignature.repository";
import { CancelSignatureRepository } from "@core/repositories/signature/CancelSignature.repository";
import { FindSignatureByClientId } from "@core/repositories/signature/FindSignatureByClientId.repository";
import { FindSignatureByOrderNumber } from "@core/repositories/signature/FindSignatureByOrder.repository";
import { injectable } from "tsyringe";

@injectable()
export class SignatureService {
  constructor(
    private findSignatureByClientId: FindSignatureByClientId,
    private findSignatureByOrderNumber: FindSignatureByOrderNumber,
    private cancelSignatureRepository: CancelSignatureRepository,
    private cancelProductSignatureRepository: CancelProductSignatureRepository,
  ) {}

  findByClientId = async (client_id: string) => {
    try {
      return this.findSignatureByClientId.find(client_id);
    } catch (error) {
      throw error;
    }
  };

  findByOrderNumber = async (orderNumber: string) => {
    try {
      return this.findSignatureByOrderNumber.find(orderNumber);
    } catch (error) {
      throw error;
    }
  };

  cancelByOrderNumber = async (
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
  ) => {
    try {
      return this.cancelSignatureRepository.cancel(orderNumber, tokenKeyData, tokenJwtData);
    } catch (error) {
      throw error;
    }
  };

  cancelProducts = async (
    signatureId: string,
    productsIds: string[],
  ) => {
    try {
      return this.cancelProductSignatureRepository.cancel(signatureId, productsIds);
    } catch (error) {
      throw error;
    }
  };
}
