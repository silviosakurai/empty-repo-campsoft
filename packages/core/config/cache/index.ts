import { FastifyInstance } from "fastify";
import { cacheEnvironment } from "@core/config/environments";
import fp from "fastify-plugin";
import FastifyRedis from "@fastify/redis";
import FastifyCaching from "@fastify/caching";

async function cacheRedisConnection(fastify: FastifyInstance) {
  let config: { host: string; port: number; password?: string } = {
    host: cacheEnvironment.cacheHost,
    port: cacheEnvironment.cachePort,
  };

  if (cacheEnvironment.cachePassword) {
    config.password = cacheEnvironment.cachePassword;
  }

  try {
    await fastify.register(FastifyRedis, config);

    fastify.register(FastifyCaching, {
      expiresIn: 300,
    });
  } catch (error) {
    console.log(error);

    fastify.logger.error(error);
  }
}

export default fp(cacheRedisConnection);
