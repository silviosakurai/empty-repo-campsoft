import { TagSwagger } from "@core/common/enums/TagSwagger";

export const webhookPaymentSchema = {
  description: "Webhook para a plataforma de pagamento",
  tags: [TagSwagger.webhook],
  produces: ["application/json"],
  security: [],
};
