import "reflect-metadata";
import fastify from "fastify";
import { paidSuccess } from "./events/paidSuccess.event";
import websocketPlugin from "@core/plugins/websocket";

const server = fastify({
  logger: true,
});
server.register(websocketPlugin);

server.register(async function (server) {
  server.get("/", { websocket: true }, (socket, req) => {
    paidSuccess(socket);
  });
});

server.listen({ port: 3003, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }

  console.log(`Server is running on port: ${address}`);
});
