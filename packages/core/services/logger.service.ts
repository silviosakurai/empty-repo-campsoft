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
    return ["password", "token"];
  }

  private sanitizeLog(message: any): any {
    let sanitizedMessage = this.getObjectMessage(message);

    this.pathsToRedact().forEach((word) => {
      const regex = new RegExp(`("${word}":".*?")`, "g");

      sanitizedMessage = sanitizedMessage.replace(regex, `"${word}":"******"`);
    });

    return sanitizedMessage;
  }

  private getObjectMessage(message: any) {
    if (typeof message === "object") {
      return JSON.stringify(message);
    }

    return message;
  }

  private parseMessage(message: any, requestId?: string) {
    const parsedMessage = this.getObjectMessage(message);
    const sanitizedMessage = this.sanitizeLog(parsedMessage);

    return requestId
      ? { requestId, log: sanitizedMessage }
      : { log: sanitizedMessage };
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
