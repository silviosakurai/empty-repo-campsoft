import { ILoggerService } from "@core/interfaces/services/ILogger.service";
import fastify, { FastifyInstance } from "fastify";
import { injectable } from "tsyringe";
import OpenSearchService from "@core/services/openSearch.service";
import { LogLevel } from "@core/common/enums/LogLevel";

@injectable()
export class LoggerService implements ILoggerService {
  private logger: FastifyInstance;

  constructor(openSearchService: OpenSearchService) {
    const dynamicLogStream = openSearchService.createDynamicLogStream();

    this.logger = fastify({
      logger: {
        stream: dynamicLogStream,
        redact: {
          paths: this.pathsToRedact(),
          censor: "******",
        },
        level: LogLevel.INFO,
      },
    });
  }

  private pathsToRedact(): string[] {
    return [
      "password",
      "*.password",
      "*.*.password",
      "*.*.*.password",
      "token",
      "*.token",
      "*.*.token",
      "*.*.*.token",
    ];
  }

  private getObjectMessage(message: any) {
    if (typeof message === "object") {
      return message;
    }

    return { msg: message };
  }

  private parseMessage(message: any, requestId?: string) {
    const parsedMessage = this.getObjectMessage(message);

    return requestId ? { requestId, ...parsedMessage } : parsedMessage;
  }

  fatal(message: any, requestId?: string) {
    const parsedMessage = this.parseMessage(message, requestId);

    this.logger.log.fatal(parsedMessage);
  }

  error(message: any, requestId?: string) {
    const parsedMessage = this.parseMessage(message, requestId);

    this.logger.log.error(parsedMessage);
  }

  warn(message: any, requestId?: string) {
    const parsedMessage = this.parseMessage(message, requestId);

    this.logger.log.warn(parsedMessage);
  }

  info(message: any, requestId?: string) {
    const parsedMessage = this.parseMessage(message, requestId);

    this.logger.log.info(parsedMessage);
  }

  debug(message: any, requestId?: string) {
    const parsedMessage = this.parseMessage(message, requestId);

    this.logger.log.debug(parsedMessage);
  }

  trace(message: any, requestId?: string) {
    const parsedMessage = this.parseMessage(message, requestId);

    this.logger.log.trace(parsedMessage);
  }
}
