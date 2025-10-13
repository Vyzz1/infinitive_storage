import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CallbackService } from './callback.service';
import { FileModule } from 'src/modules/file/file.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    FileModule,
    RabbitMQModule.forRoot({
      uri: process.env.RABBIT_URI as string,
      exchanges: [
        {
          name: 'message_tasks',
          type: 'fanout',
        },
        {
          name: 'thumbnail_exchange',
          type: 'topic',
        },
      ],
      connectionInitOptions: { wait: true, timeout: 2000 },
    }),
  ],
  providers: [QueueService, CallbackService],
  exports: [QueueService, CallbackService, RabbitMQModule],
})
export class QueueModule {}
