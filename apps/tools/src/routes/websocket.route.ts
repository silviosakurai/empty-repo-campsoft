import WebsocketController from '../controllers/websocket';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { websocketSchema } from '@core/validations/websocket';

export default async function websocketRoute(app: FastifyInstance) {
  const controller = container.resolve(WebsocketController);

  app.get('/', { websocket: true, schema: websocketSchema }, (socket, req) => {
    controller.listWebhook(socket, req);
  });
}
