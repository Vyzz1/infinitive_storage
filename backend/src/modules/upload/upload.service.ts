import { Injectable } from '@nestjs/common';
import s3Client from 'src/s3/s3.client';
import { CreateFileRequest, FileType } from '../file/dto';
import { FileService } from '../file/file.service';

@Injectable()
export class UploadService {
  constructor(private readonly fileService: FileService) {}
  private async handleUploadFileToS3(
    file: Express.Multer.File,
    userId: string,
    folderId?: string | undefined,
  ) {
    const decodedName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    await s3Client.uploadToS3(file.buffer, decodedName, file.mimetype);
    const fileURL = s3Client.generatePublicUrl(decodedName);
    const fileParams: CreateFileRequest = {
      fileName: decodedName,
      extension: file.mimetype,
      url: fileURL,
      folderId,
      size: file.size,
      type: this.getFileType(file.mimetype),
    };
    await this.fileService.createFile(userId, fileParams);

    return s3Client.generatePublicUrl(decodedName);
  }

  async uploadFileToS3(
    files: Express.Multer.File[],
    userId: string,
    folderId?: string,
  ) {
    const uploadPromises = files.map((file) =>
      this.handleUploadFileToS3(file, userId, folderId),
    );
    return await Promise.all(uploadPromises);
  }

  private getFileType(mime: string) {
    if (mime.startsWith('image/')) return FileType.IMAGE;
    if (mime.startsWith('video/')) return FileType.VIDEO;
    if (mime.startsWith('audio/')) return FileType.AUDIO;
    if (mime.startsWith('application/pdf')) return FileType.PDF;
    if (
      mime.startsWith('application/msword') ||
      mime.startsWith('application/vnd') ||
      mime.startsWith('text/')
    )
      return FileType.DOCUMENT;

    return FileType.OTHER;
  }
}
