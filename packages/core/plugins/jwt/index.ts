import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { generalEnvironment } from "@core/config/environments";

async function jwtPlugin(fastify: FastifyInstance) {
  fastify.register(fastifyJwt, {
    secret: generalEnvironment.jwtSecret,
    sign: {
      expiresIn: generalEnvironment.jwtSecretExpiresIn,
    },
  });
}

export default fp(jwtPlugin);
