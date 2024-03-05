import { FastifyInstance } from "fastify";
import { cacheEnvironment } from "@core/config/environments";
import fp from "fastify-plugin";
import FastifyRedis from "@fastify/redis";
import FastifyCaching from "@fastify/caching";

async function cacheRedisConnection(fastify: FastifyInstance) {
  fastify
    .register(FastifyRedis, {
      host: cacheEnvironment.cacheHost,
      password: cacheEnvironment.cachePassword,
      port: cacheEnvironment.cachePort,
    })
    .register(FastifyCaching, {
      expiresIn: 300,
    });
}

export default fp(cacheRedisConnection);
