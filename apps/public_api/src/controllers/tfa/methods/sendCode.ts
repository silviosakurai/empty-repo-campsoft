import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import {
  SendCodeLoginTFARequest,
  SendCodeTFARequest,
} from '@core/useCases/tfa/dtos/SendCodeTFARequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserIdTFASenderUserCase } from '@core/useCases/tfa/UserIdTFASender.useCase';
import { container } from 'tsyringe';
import { TFAType } from '@core/common/enums/models/tfa';
import { isUuid } from '@core/common/functions/isUuid';
import { TFunction } from 'i18next';
import { TFAVerificationError } from '@core/common/exceptions/TFAVerificationError';
import { LoginUserTFA } from '@core/interfaces/services/IClient.service';
import { ITokenKeyData } from '@core/common/interfaces/ITokenKeyData';
import NotificationService from '@core/services/notification.service';

const handleTfaType = async (
  t: TFunction<'translation', undefined>,
  type: TFAType,
  tokenKeyData: ITokenKeyData,
  loginUserTFA: LoginUserTFA
): Promise<boolean> => {
  const service = container.resolve(NotificationService);

  return service.executeTfa(t, {
    tokenKeyData,
    type,
    loginUserTFA,
  } as SendCodeLoginTFARequest);
};

const loginUserId = async (
  t: TFunction<'translation', undefined>,
  type: TFAType,
  tokenKeyData: ITokenKeyData,
  login: string
): Promise<LoginUserTFA> => {
  const isUuidValid = isUuid(login);

  const sendUserIdTFAUserCase = container.resolve(UserIdTFASenderUserCase);

  if (isUuidValid) {
    const userIdTFA = await sendUserIdTFAUserCase.execute({
      login,
      type,
      tokenKeyData,
    } as SendCodeTFARequest);

    if (!userIdTFA) {
      throw new TFAVerificationError(t('error_send_code_verification'));
    }

    return {
      clientId: login,
      login: userIdTFA.login,
    };
  }

  const findClient = await sendUserIdTFAUserCase.findClientByEmailPhone(login);

  return {
    clientId: findClient,
    login,
  };
};

export const sendCode = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { t, tokenKeyData } = request;
  const { type, login } = request.body as {
    type: TFAType;
    login: string;
  };

  try {
    const loginUserTFA = await loginUserId(t, type, tokenKeyData, login);
    const response = await handleTfaType(t, type, tokenKeyData, loginUserTFA);

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('error_send_code_verification'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    if (error instanceof TFAVerificationError) {
      return sendResponse(reply, {
        message: error.message,
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
