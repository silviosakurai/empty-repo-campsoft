import { codeTfaResponseSchema } from "@core/schema/tfa/codeTfaResponseSchema";
import { Static } from "@sinclair/typebox";

export type ValidateCodeTFAResponse = Static<typeof codeTfaResponseSchema>;
