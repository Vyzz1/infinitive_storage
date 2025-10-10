import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import {
  CreateFileRequest,
  GetFilesQuery,
  UpdateFileRequest,
  MoveFileRequest,
  FileType,
} from './dto';
import { User } from 'src/common/decorators/user/user.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('file')
@UseGuards(AuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  async createFile(@User() user: any, @Body() createData: CreateFileRequest) {
    return this.fileService.createFile(user.id, createData);
  }

  @Get()
  async getFiles(@User() user: any, @Query() query: GetFilesQuery) {
    return this.fileService.getFiles(user.id, query);
  }

  @Put(':id')
  async updateFile(
    @User() user: any,
    @Param('id') id: string,
    @Body() updateData: UpdateFileRequest,
  ) {
    return this.fileService.updateFile(user.id, id, updateData);
  }

  @Delete(':id')
  async deleteFile(@User() user: any, @Param('id') id: string) {
    return this.fileService.deleteFile(user.id, id);
  }

  @Get('folder/:folderId')
  async getFilesByFolder(
    @User() user: any,
    @Param('folderId') folderId: string,
  ) {
    return this.fileService.getFilesByFolder(user.id, folderId);
  }

  @Get('type/:type')
  async getFilesByType(@User() user: any, @Param('type') type: FileType) {
    return this.fileService.getFilesByType(user.id, type);
  }

  @Get('root')
  async getRootFiles(@User() user: any) {
    return this.fileService.getRootFiles(user.id);
  }

  @Put(':id/move')
  async moveFile(
    @User() user: any,
    @Param('id') id: string,
    @Body() moveData: MoveFileRequest,
  ) {
    return this.fileService.moveFile(
      user.id,
      id,
      moveData.targetFolderId || null,
    );
  }
}
