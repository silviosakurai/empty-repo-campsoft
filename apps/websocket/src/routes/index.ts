import { FastifyInstance } from "fastify";
import websocketRoute from "./websocket.route";

export default async function (server: FastifyInstance) {
  await websocketRoute(server);
}
