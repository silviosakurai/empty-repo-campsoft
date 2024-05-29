import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import fp from "fastify-plugin";

async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: true,
  });
}

export default fp(corsPlugin, { name: "cors-plugin" });
