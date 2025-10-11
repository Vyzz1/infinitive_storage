import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { FileService } from 'src/modules/file/file.service';

@Injectable()
export class CallbackService {
  constructor(private readonly fileService: FileService) {}

  @RabbitSubscribe({
    exchange: 'thumbnail_exchange',
    routingKey: 'docs.thumbnail.created',
    queueOptions: { durable: true, autoDelete: false },
    createQueueIfNotExists: true,
  })
  public async handleThumbnailCompleted(payload: {
    id: string;
    thumbnailUrl: string;
  }) {
    try {
      Logger.log(`Received completed thumbnail: ${payload.id}`);

      await this.fileService.updateThumbnail(payload.id, payload.thumbnailUrl);

      Logger.log(` Updated thumbnail in DB: ${payload.thumbnailUrl}`);
    } catch (error) {
      Logger.error(`Error updating thumbnail for ID ${payload.id}: ${error}`);
    }
  }
}
