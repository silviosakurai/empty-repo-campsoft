import { FastifyInstance } from 'fastify';
import websocketRoute from './websocket.route';
import paymentRoute from './payment.route';

export default async function (server: FastifyInstance) {
  await websocketRoute(server);
  await paymentRoute(server);
}
