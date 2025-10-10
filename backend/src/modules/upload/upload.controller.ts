import {
  Body,
  Controller,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { User } from 'src/common/decorators/user/user.decorator';

const fileValidator = new ParseFilePipe({
  fileIsRequired: true,
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), // 10MB
  ],
});

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles(fileValidator)
    files: Express.Multer.File[],
    @Body() body: any,
    @User() user: any,
  ) {
    Logger.log(body, 'Body in upload');
    return await this.uploadService.uploadFileToS3(
      files,
      user.id,
      body.folderId,
    );
  }
}
