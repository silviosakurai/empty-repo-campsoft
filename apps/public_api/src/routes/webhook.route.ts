import WebhookController from '@/controllers/webhook';
import { FastifyInstance } from 'fastify';
import WebSocket from 'ws';
import { container } from 'tsyringe';

export default async function webhooksRoutes(app: FastifyInstance) {
  const controller = container.resolve(WebhookController);

  app.get(
    '/webhook/payments',
    {
      websocket: true,
    },
    (socket, request) => {
      controller.paymentWebhook(socket, request);
    }
  );

  // const wsServer = new WebSocket.Server({ noServer: true });

  // wsServer.on('connection', (ws, err) => {
  //   ws.on('message', (message: string) => {
  //     console.log('Mensagem recebida:', message);
  //     ws.send('Olá cliente!');
  //   });

  //   ws.on('close', () => {
  //     console.log('errrrrrrrrrrrrrrrrrrrrrrr');
  //     console.log(err);
  //     console.log('Conexão fechada.');
  //   });
  // });

  // app.server.on('upgrade', (request, socket, head) => {
  //   wsServer.handleUpgrade(request, socket, head, (ws) => {
  //     wsServer.emit('connection');
  //   });
  // });
}
