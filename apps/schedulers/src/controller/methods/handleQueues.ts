import { QueueName } from '@core/common/enums/Queue';
import { PaymentRecurrenceSchedulerResponse } from '@core/useCases/task/dto/PaymentRecurrenceSchedulerResponse.dto';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { RecurrencePayer } from '@core/useCases/finance/RecurrencePayer.useCase';
import { QueueService } from '@core/services/queue.service';

export const handleQueue = async ({ i18n, logger }: FastifyInstance) => {
  const service = container.resolve(RecurrencePayer);
  const queue = new QueueService(QueueName.PAYMENT_RECURRENCE);

  await queue.consumeMessages((message) => {
    (async () => {
      if (message) {
        try {
          const body = JSON.parse(
            message.content.toString()
          ) as PaymentRecurrenceSchedulerResponse;

          const anyErrors = await service.pay(i18n, body);

          if (!anyErrors) {
            queue.channel.nack(message, false, false);
          }

          if (anyErrors.valueOf() === Object) {
            return queue.channel.nack(
              { ...message, content: Buffer.from(JSON.stringify(anyErrors)) },
              false,
              false
            );
          }

          console.log(`Queue of day ${body.day} acknowledge.`);
          queue.channel.ack(message);
        } catch (error) {
          logger.error(error, 'payment-recurrence-consume-error');
          queue.channel.nack(message, false, false);
        }
      }
    })();
  });
};
