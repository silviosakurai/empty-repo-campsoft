import { FindSignatureByClientId } from "@core/repositories/signature/FindSignatureByClientId.repository";
import { injectable } from "tsyringe";

@injectable()
export class SignatureService {
  constructor(private findSignatureByClientId: FindSignatureByClientId) {}

  findByClientId = async (client_id: string) => {
    try {
      return await this.findSignatureByClientId.find(client_id);
    } catch (error) {
      throw error;
    }
  };
}
