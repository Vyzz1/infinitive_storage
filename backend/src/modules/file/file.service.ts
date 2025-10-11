import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq, isNull, like } from 'drizzle-orm';
import { PagedResult } from 'src/common/shared/paged-result';
import db from 'src/db';
import { files, folders } from 'src/db/schema';
import {
  CreateFileRequest,
  FileType,
  GetFilesQuery,
  UpdateFileRequest,
} from './dto';

@Injectable()
export class FileService {
  async createFile(userId: string, fileData: CreateFileRequest) {
    let location = 'root';

    if (fileData.folderId) {
      const folderList = await db
        .select()
        .from(folders)
        .where(
          and(eq(folders.id, fileData.folderId), eq(folders.userId, userId)),
        )
        .limit(1);

      const folder = folderList[0];
      if (!folder) {
        throw new NotFoundException('Parent folder not found');
      }

      location =
        folder.location === 'root'
          ? folder.name
          : `${folder.location}/${folder.name}`;
    }

    const [newFile] = await db
      .insert(files)
      .values({
        userId,
        ...fileData,
        location,
      })
      .returning();

    if (!newFile) {
      throw new BadRequestException('Failed to create file');
    }

    return newFile;
  }

  async updateThumbnail(fileId: string, thumbnailUrl: string) {
    const existingFile = await db
      .select()
      .from(files)
      .where(eq(files.id, fileId))
      .limit(1);
    if (!existingFile || existingFile.length === 0) {
      throw new NotFoundException('File not found');
    }
    await db
      .update(files)
      .set({ thumbnail: thumbnailUrl, updatedAt: new Date() })
      .where(eq(files.id, fileId));
    return;
  }

  async getFiles(userId: string, query: GetFilesQuery) {
    const {
      type,
      folderId,
      search,
      page = 0,
      limit = 10,
      sortBy,
      sortOrder,
    } = query;

    const conditions = [eq(files.userId, userId)];

    if (type) conditions.push(eq(files.type, type));
    if (folderId) conditions.push(eq(files.folderId, folderId));
    if (search) conditions.push(like(files.fileName, `%${search}%`));

    const whereClause =
      conditions.length > 1 ? and(...conditions) : conditions[0];

    const totalResult = await db.$count(files, whereClause);

    const total = totalResult[0]?.count || 0;
    const offset = page * limit;

    let orderByColumn;
    switch (sortBy) {
      case 'name':
        orderByColumn = files.fileName;
        break;
      case 'updatedAt':
        orderByColumn = files.updatedAt;
        break;
      case 'type':
        orderByColumn = files.type;
        break;
      case 'createdAt':
      default:
        orderByColumn = files.createdAt;
        break;
    }

    const orderBy =
      sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn);
    const fileList = await db
      .select()
      .from(files)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return new PagedResult(fileList, total, page, limit).response;
  }

  async getFileById(userId: string, fileId: string) {
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .limit(1);

    return file || null;
  }

  async updateFile(
    userId: string,
    fileId: string,
    updateData: UpdateFileRequest,
  ) {
    const existingFile = await this.getFileById(userId, fileId);
    if (!existingFile) {
      throw new NotFoundException('File not found');
    }

    await db
      .update(files)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    const updatedFile = await this.getFileById(userId, fileId);
    if (!updatedFile) {
      throw new BadRequestException('Failed to update file');
    }
    return updatedFile;
  }

  async deleteFile(userId: string, fileId: string) {
    const fileToDelete = await this.getFileById(userId, fileId);

    if (!fileToDelete) {
      throw new NotFoundException('File not found');
    }

    await db
      .delete(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    return fileToDelete;
  }

  async getFilesByFolder(userId: string, folderId: string) {
    const condition = and(
      eq(files.userId, userId),
      eq(files.folderId, folderId),
    );

    return await db
      .select()
      .from(files)
      .where(condition)
      .orderBy(desc(files.createdAt));
  }

  async getFilesByType(userId: string, fileType: FileType) {
    return await db
      .select()
      .from(files)
      .where(and(eq(files.userId, userId), eq(files.type, fileType)))
      .orderBy(desc(files.createdAt));
  }

  async getRootFiles(userId: string) {
    return await db
      .select()
      .from(files)
      .where(and(eq(files.userId, userId), isNull(files.folderId)))
      .orderBy(desc(files.createdAt));
  }

  async moveFile(
    userId: string,
    fileId: string,
    targetFolderId: string | null,
  ) {
    const file = await this.getFileById(userId, fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    let newLocation = 'root';

    if (targetFolderId) {
      const targetFolderList = await db
        .select()
        .from(folders)
        .where(and(eq(folders.id, targetFolderId), eq(folders.userId, userId)))
        .limit(1);

      const targetFolder = targetFolderList[0];
      if (!targetFolder) {
        throw new NotFoundException('Target folder not found');
      }

      newLocation =
        targetFolder.location === 'root'
          ? targetFolder.name
          : `${targetFolder.location}/${targetFolder.name}`;
    }

    await db
      .update(files)
      .set({
        folderId: targetFolderId,
        location: newLocation,
        updatedAt: new Date(),
      })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    return await this.getFileById(userId, fileId);
  }
}
