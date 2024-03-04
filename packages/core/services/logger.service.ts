import fastify, { FastifyInstance } from "fastify";
import { injectable } from "tsyringe";

@injectable()
export class LoggerService {
  private logger: FastifyInstance;

  constructor() {
    this.logger = fastify({
      logger: {
        redact: ['cpf', '*.cpf'],
      }
    });
  }

  info(message: any, ) {
    this.logger.log.info(message);
  }

  error(message: any) {
    this.logger.log.error(message);
  }

  debug(message: any) {
    this.logger.log.debug(message);
  }
}
