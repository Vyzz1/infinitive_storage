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
import { FolderService } from './folder.service';
import {
  CreateFolderRequest,
  GetFoldersQuery,
  UpdateFolderRequest,
  MoveFolderRequest,
} from './dto';
import { User } from 'src/common/decorators/user/user.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('folder')
@UseGuards(AuthGuard)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  async createFolder(
    @User() user: any,
    @Body() createData: CreateFolderRequest,
  ) {
    return this.folderService.createFolder(user.id, createData);
  }

  @Get()
  async getFolders(@User() user: any, @Query() query: GetFoldersQuery) {
    return this.folderService.getFolders(user.id, query);
  }

  @Get('root')
  async getRootFolders(@User() user: any) {
    return this.folderService.getRootFolders(user.id);
  }

  @Get(':id')
  async getFolderById(@User() user: any, @Param('id') id: string) {
    return this.folderService.getFolderById(user.id, id);
  }

  @Put(':id')
  async updateFolder(
    @User() user: any,
    @Param('id') id: string,
    @Body() updateData: UpdateFolderRequest,
  ) {
    return this.folderService.updateFolder(user.id, id, updateData);
  }

  @Delete(':id')
  async deleteFolder(@User() user: any, @Param('id') id: string) {
    return this.folderService.deleteFolder(user.id, id);
  }

  @Get('parent/:parentId')
  async getFoldersByParent(
    @User() user: any,
    @Param('parentId') parentId: string,
  ) {
    return this.folderService.getFoldersByParent(user.id, parentId);
  }

  @Get(':id/with-subfolders')
  async getFolderWithSubfolders(@User() user: any, @Param('id') id: string) {
    return this.folderService.getFolderWithSubfolders(user.id, id);
  }

  @Put(':id/move')
  async moveFolder(
    @User() user: any,
    @Param('id') id: string,
    @Body() moveData: MoveFolderRequest,
  ) {
    return this.folderService.moveFolder(
      user.id,
      id,
      moveData.targetParentId || null,
    );
  }
}
