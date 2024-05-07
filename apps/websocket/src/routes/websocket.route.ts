import { FastifyInstance } from "fastify";
import {
  addClientAsListener,
  removeClientAsListener,
} from "@/functions/websocket";

export default async function websocketRoute(server: FastifyInstance) {
  server.get("/", { websocket: true }, (socket, req) => {
    addClientAsListener(socket);

    socket.on("close", () => {
      removeClientAsListener(socket);
    });
  });
}
