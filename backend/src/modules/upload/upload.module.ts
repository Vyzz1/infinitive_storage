import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
