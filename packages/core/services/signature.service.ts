import { SignatureByClientIdViewer } from "@core/repositories/signature/SignatureByClientIdViewer.repository";
import { injectable } from "tsyringe";

@injectable()
export class SignatureService {
  constructor(
    private readonly signatureViewerByClientId: SignatureByClientIdViewer
  ) {}

  findByClientId = async (client_id: string) => {
    return await this.signatureViewerByClientId.find(client_id);
  };
}
