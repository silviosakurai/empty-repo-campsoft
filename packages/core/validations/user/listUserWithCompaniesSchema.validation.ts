import { Language } from "@core/common/enums/Language";
import { SortOrder } from "@core/common/enums/SortOrder";
import { Status } from "@core/common/enums/Status";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { ClientFields, ClientStatus } from "@core/common/enums/models/client";
import { pagingRequestSchema } from "@core/schema/paging/pagingRequestSchema";
import { userListGroupedByCompanyResponseSchema } from "@core/schema/user/userListGroupedByCompanyResponseSchema";
import { Type } from "@sinclair/typebox";

export const listUserWithCompaniesSchema = {
  description: "Lista os usuários",
  tags: [TagSwagger.user],
  produces: ["application/json"],
  security: [
    {
      authenticateJwt: [],
    },
  ],
  headers: Type.Object({
    "Accept-Language": Type.Optional(
      Type.String({
        description: "Idioma preferencial para a resposta",
        enum: Object.values(Language),
        default: Language.pt,
      })
    ),
  }),
  querystring: Type.Object({
    ...pagingRequestSchema.properties,
    id: Type.Optional(Type.String()),
    status: Type.Optional(
      Type.String({
        enum: Object.values(ClientStatus),
        default: Status.ACTIVE,
      })
    ),
    email: Type.Optional(Type.String({ format: "email" })),
    name: Type.Optional(Type.String()),
    cpf: Type.Optional(Type.String({ minLength: 11, maxLength: 11 })),
    sort_by: Type.Optional(
      Type.String({
        enum: Object.values(ClientFields),
        default: ClientFields.user_id,
      })
    ),
    sort_order: Type.Optional(
      Type.String({ enum: Object.values(SortOrder), default: SortOrder.DESC })
    ),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: userListGroupedByCompanyResponseSchema,
      },
      { description: "Successful" }
    ),
    401: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Unauthorized" }
    ),
    404: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Not Found" }
    ),
    500: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Internal Server Error" }
    ),
  },
};
