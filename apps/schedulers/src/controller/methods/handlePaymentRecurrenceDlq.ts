import { QueueName } from '@core/common/enums/Queue';
import { QueueService } from '@core/services/queue.service';
import { PaymentRecurrenceSchedulerResponse } from '@core/useCases/task/dto/PaymentRecurrenceSchedulerResponse.dto';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { RecurrencePaymentDlqHandlerUseCase } from '@core/useCases/finance/RecurrencePaymentDlqHandler.useCase';

export const handlePaymentRecurrenceDlq = async ({
  logger,
}: FastifyInstance) => {
  const queue = new QueueService(QueueName.PAYMENT_RECURRENCE_DLQ);
  const service = container.resolve(RecurrencePaymentDlqHandlerUseCase);

  await queue.consumeMessages((message) => {
    (async () => {
      if (message) {
        try {
          const body = JSON.parse(
            message.content.toString()
          ) as PaymentRecurrenceSchedulerResponse;

          await service.handle(body);

          console.log(
            `Queue ${QueueName.PAYMENT_RECURRENCE_DLQ} of day ${body.day} acknowledge.`
          );
          queue.channel.ack(message);
        } catch (error) {
          console.log(error);
          logger.error(error, 'payment-recurrence-dlq-consume-error');
        }
      }
    })();
  });
};
