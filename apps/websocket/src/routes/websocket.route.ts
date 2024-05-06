import { FastifyInstance } from "fastify";
import { paidSuccess } from "../events/paidSuccess.event";

export default async function websocketRoute(server: FastifyInstance) {
  server.get("/", { websocket: true }, (socket, req) => {
    paidSuccess(socket);
  });
}
