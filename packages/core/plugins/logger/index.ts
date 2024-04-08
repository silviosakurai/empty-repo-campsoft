import { LoggerService } from "@core/services/logger.service";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import OpenSearchService from "@core/services/openSearch.service";
import { container } from "tsyringe";

const loggerServicePlugin = async (fastify: FastifyInstance) => {
  const openSearchService = container.resolve(OpenSearchService);

  fastify.decorate("logger", new LoggerService(openSearchService));
};

export default fp(loggerServicePlugin, { name: "logger-service-plugin" });
