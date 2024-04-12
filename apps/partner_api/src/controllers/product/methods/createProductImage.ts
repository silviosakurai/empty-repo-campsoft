import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateProductImageRequest } from '@core/useCases/product/dtos/CreateProductImageRequest.dto';
import { Readable } from 'stream';

export const createProductImage = async (
  request: FastifyRequest<{ Params: CreateProductImageRequest }>,
  reply: FastifyReply
) => {
  const imageReadable = request.raw as Readable;

  console.log('imageReadableeeeeeeeeeeeeeeeeeeeee');
  console.log(imageReadable);
};
