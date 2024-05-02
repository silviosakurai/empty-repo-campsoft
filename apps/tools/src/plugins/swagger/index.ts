import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import fp from 'fastify-plugin';
import { generalEnvironment } from '@core/config/environments';
import routes from '@/routes';
import { TagSwagger } from '@core/common/enums/TagSwagger';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const swaggerPlugin = async (fastify: FastifyInstance) => {
  await fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Mania de App',
        description:
          'Seja bem-vindo ao Mania de App! Nesta documentação, apresentaremos uma visão detalhada da API. Através deste guia, você obterá uma compreensão abrangente do desenvolvimento, implementação e manutenção deste projeto.',
        version: '1.0.0',
      },
      host: generalEnvironment.appUrlTools,
      schemes: [generalEnvironment.protocol],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        {
          name: TagSwagger.webhook,
          description: 'End-points relacionados a webhook',
        },
        {
          name: TagSwagger.websocket,
          description: 'End-points relacionados a websocket',
        },
      ],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'none',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (
        request: FastifyRequest,
        reply: FastifyReply,
        next: HookHandlerDoneFunction
      ) {
        next();
      },
      preHandler: function (
        request: FastifyRequest,
        reply: FastifyReply,
        next: HookHandlerDoneFunction
      ) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header: string): string => {
      return header;
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>();
  fastify.register(routes);
};

export default fp(swaggerPlugin, { name: 'swagger' });
