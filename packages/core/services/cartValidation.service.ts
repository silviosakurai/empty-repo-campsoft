import { TFunction } from "i18next";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { injectable } from "tsyringe";
import { OrderService } from "./order.service";
import { SignatureService } from "./signature.service";
import { CreateCartRequest } from "@core/useCases/cart/dtos/CreateCartRequest.dto";
import { ClientService } from "./client.service";

@injectable()
export class CartValidationService {
  constructor(
    private readonly orderService: OrderService,
    private readonly signatureService: SignatureService,
    private readonly clientService: ClientService
  ) {}

  async validate(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    payload: CreateCartRequest
  ): Promise<void> {
    await Promise.all([
      this.validatePreviousOrder(t, payload),
      this.validateSignaturePlan(t, tokenJwtData, payload),
      this.validateClient(t, tokenJwtData),
    ]);
  }

  private async validatePreviousOrder(
    t: TFunction<"translation", undefined>,
    payload: CreateCartRequest
  ): Promise<void> {
    if (payload?.previous_order_id) {
      const orderIsExists = await this.orderService.orderIsExists(
        payload.previous_order_id
      );

      if (!orderIsExists) {
        throw new Error(t("previous_order_not_found"));
      }
    }
  }

  private async validateSignaturePlan(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    payload: CreateCartRequest
  ): Promise<void> {
    if (payload.subscribe) {
      const isSignaturePlanActive =
        await this.signatureService.isSignaturePlanActiveByClientId(
          tokenJwtData.clientId,
          payload.plan.plan_id
        );

      if (isSignaturePlanActive) {
        throw new Error(t("plan_already_active"));
      }
    }
  }

  private async validateClient(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData
  ): Promise<void> {
    const userFounded = await this.clientService.view(tokenJwtData.clientId);

    if (!userFounded) {
      throw new Error(t("client_not_found"));
    }
  }
}
