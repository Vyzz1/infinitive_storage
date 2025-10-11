import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QueueService {
  private logger = new Logger(QueueService.name);
  constructor(private readonly amqp: AmqpConnection) {}

  async publishThumbnailTask(request: {
    id: string;
    filename: string;
    mimetype: string;
    data: string;
  }): Promise<void> {
    await this.amqp.publish(
      'thumbnail_exchange',
      'thumbnail.generate',
      request,
      {
        persistent: true,
      },
    );
    this.logger.log(`Published thumbnail task for ${request.filename}`);
  }

  async publishWelcomeEmailTask(email: string, name: string): Promise<void> {
    await this.amqp.publish('welcome_exchange', 'welcome', { email, name });
    this.logger.log(`Published welcome email task for ${email}`);
  }
}
