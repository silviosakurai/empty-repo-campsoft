import { PaymentSellerViewerByEmailRepository } from "@core/repositories/payment/PaymentSellerViewerByEmail.repository";
import { injectable } from "tsyringe";

@injectable()
export class SellerService {
  constructor(
    private readonly sellerViewerByEmailRepository: PaymentSellerViewerByEmailRepository
  ) {}

  viewByEmail = async (email: string) => {
    return this.sellerViewerByEmailRepository.view(email);
  };
}
