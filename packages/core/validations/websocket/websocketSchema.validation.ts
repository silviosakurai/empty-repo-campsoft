import { TagSwagger } from "@core/common/enums/TagSwagger";

export const websocketSchema = {
  description: "Websocket para a plataforma de pagamento",
  tags: [TagSwagger.websocket],
  produces: ["application/json"],
  security: [],
};
