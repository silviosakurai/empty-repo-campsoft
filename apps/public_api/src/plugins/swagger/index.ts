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
      host: generalEnvironment.appUrlPublic,
      schemes: [generalEnvironment.protocol],
      consumes: ['application/json'],
      securityDefinitions: {
        authenticateJwt: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Token JWT para autenticação',
        },
        authenticateKeyApi: {
          type: 'apiKey',
          in: 'header',
          name: 'keyapi',
          description: 'Chave API para autenticação',
        },
        authenticateTfa: {
          type: 'apiKey',
          in: 'header',
          name: 'tokentfa',
          description: 'Chave TFA para autenticação',
        },
      },
      produces: ['application/json'],
      tags: [
        {
          name: TagSwagger.authentication,
          description: 'End-points relacionados à autenticação',
        },
        {
          name: TagSwagger.banner,
          description: 'End-points relacionados ao banner',
        },
        {
          name: TagSwagger.health,
          description: 'End-points relacionados à saúde da aplicação',
        },
        {
          name: TagSwagger.order,
          description: 'End-points relacionados ao pedido',
        },
        {
          name: TagSwagger.plan,
          description: 'End-points relacionados ao plano',
        },
        {
          name: TagSwagger.product,
          description: 'End-points relacionados ao produto',
        },
        {
          name: TagSwagger.tfa,
          description: 'End-points relacionados ao TFA',
        },
        {
          name: TagSwagger.voucher,
          description: 'End-points relacionados ao voucher',
        },
        {
          name: TagSwagger.user,
          description: 'End-points relacionados ao usuário',
        },
        {
          name: TagSwagger.review,
          description: 'End-points relacionados à avaliação',
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
