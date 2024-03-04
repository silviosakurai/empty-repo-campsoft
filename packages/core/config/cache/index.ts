import { FastifyInstance } from "fastify";
import { cacheEnvironment } from "../environments";
import fp from "fastify-plugin";
import FastifyRedis from "@fastify/redis";

async function cacheRedisConnection(fastify: FastifyInstance) {
  fastify.register(FastifyRedis, {
    host: cacheEnvironment.cacheHost,
    password: cacheEnvironment.cachePassword,
    port: cacheEnvironment.cachePort,
    family: 4, // 4 (IPv4) or 6 (IPv6})
  });
}

export default fp(cacheRedisConnection);
