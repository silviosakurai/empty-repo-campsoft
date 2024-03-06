import { ILoggerService } from "@core/interfaces/services/ILogger.service";
import fastify, { FastifyInstance } from "fastify";
import { injectable } from "tsyringe";

@injectable()
export class LoggerService implements ILoggerService {
  private logger: FastifyInstance;

  constructor() {
    this.logger = fastify({
      logger: {
        redact: ['cpf', '*.cpf', '*.*.cpf'],
      }
    });
  }

  private getObjectMessage(message: any) {
    if (typeof message === 'object') {
      return message;
    }

    return { msg: message };
  }

  private parseMessage(message: any, requestId?: string) {
    const parsedMessage = this.getObjectMessage(message);
    return requestId ? { requestId, ...parsedMessage } : parsedMessage;
  }

  info(message: any, requestId?: string) {
    const parsedMessage = this.parseMessage(message, requestId);
    this.logger.log.info(parsedMessage);
  }

  error(message: any, requestId?: string) {
    const parsedMessage = this.parseMessage(message, requestId);
    this.logger.log.error(parsedMessage);
  }

  debug(message: any, requestId?: string) {
    const parsedMessage = this.parseMessage(message, requestId);
    this.logger.log.debug(parsedMessage);
  }
}
