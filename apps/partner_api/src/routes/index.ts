import { FastifyInstance } from 'fastify';
import productRoutes from '@/routes/product.route';
import orderRoutes from '@/routes/order.route';

export default async function (server: FastifyInstance) {
  await server.register(productRoutes);
  await server.register(orderRoutes);
}
