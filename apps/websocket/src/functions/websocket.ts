import { WebSocket } from "@fastify/websocket";

const clients: WebSocket[] = [];

export function addClientAsListener(client: WebSocket) {
  clients.push(client);
}

export function removeClientAsListener(client: WebSocket) {
  const index = clients.indexOf(client);
  if (index !== -1) {
    clients.splice(index, 1);
  }
}

export function sendMessageToClients(message: string): void {
  clients.forEach((client) => {
    client.send(message);
  });
}
