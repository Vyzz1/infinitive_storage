import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { FileModule } from '../file/file.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [FileModule, QueueModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
