import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import websocket from "@fastify/websocket";

const websocketPlugin = async (fastify: FastifyInstance) => {
  fastify.register(websocket);
};

export default fp(websocketPlugin, { name: "websocket-service-plugin" });
