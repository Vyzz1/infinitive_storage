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
  CreateFolderRequest,
  MoveFolderRequest,
  UpdateFolderRequest,
  GetFoldersQuery,
} from './dto';

@Injectable()
export class FolderService {
  async createFolder(userId: string, folderData: CreateFolderRequest) {
    const [newFolder] = await db
      .insert(folders)
      .values({
        userId,
        ...folderData,
      })
      .returning();

    if (!newFolder) {
      throw new BadRequestException('Failed to create folder');
    }
    return newFolder;
  }

  async getRootFolders(userId: string) {
    return await db
      .select()
      .from(folders)
      .where(and(eq(folders.userId, userId), isNull(folders.parentId)))
      .orderBy(desc(folders.createdAt));
  }

  async getFolders(userId: string, query: GetFoldersQuery) {
    const { parentId, search, page = 0, limit = 10, sortBy, sortOrder } = query;

    const conditions = [eq(folders.userId, userId)];

    if (parentId) conditions.push(eq(folders.parentId, parentId));
    if (search) conditions.push(like(folders.name, `%${search}%`));

    const whereClause =
      conditions.length > 1 ? and(...conditions) : conditions[0];

    const totalResult = await db.$count(folders, whereClause);

    const total = totalResult[0]?.count || 0;
    const offset = page * limit;

    let orderByColumn;
    switch (sortBy) {
      case 'name':
        orderByColumn = folders.name;
        break;
      case 'updatedAt':
        orderByColumn = folders.updatedAt;
        break;
      case 'createdAt':
      default:
        orderByColumn = folders.createdAt;
        break;
    }

    const orderBy =
      sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn);

    const folderList = await db
      .select()
      .from(folders)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return new PagedResult(folderList, total, page, limit).response;
  }

  async getFolderById(userId: string, folderId: string) {
    const folderList = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)))
      .limit(1);

    return folderList[0] || null;
  }

  async updateFolder(
    userId: string,
    folderId: string,
    updateData: UpdateFolderRequest,
  ) {
    const existingFolder = await this.getFolderById(userId, folderId);
    if (!existingFolder) {
      throw new NotFoundException('Folder not found');
    }

    await db
      .update(folders)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));

    const updatedFolder = await this.getFolderById(userId, folderId);
    if (!updatedFolder) {
      throw new BadRequestException('Failed to update folder');
    }
    return updatedFolder;
  }

  async deleteFolder(userId: string, folderId: string) {
    const folderToDelete = await this.getFolderById(userId, folderId);

    if (!folderToDelete) {
      throw new NotFoundException('Folder not found');
    }

    await db
      .delete(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));

    return folderToDelete;
  }

  async getFoldersByParent(userId: string, parentId: string) {
    const condition = and(
      eq(folders.userId, userId),
      eq(folders.parentId, parentId),
    );

    return await db
      .select()
      .from(folders)
      .where(condition)
      .orderBy(desc(folders.createdAt));
  }

  async getFolderWithSubfolders(userId: string, folderId: string) {
    const folder = await this.getFolderById(userId, folderId);
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const subfolders = await this.getFoldersByParent(userId, folderId);

    return {
      ...folder,
      subfolders,
    };
  }

  async moveFolder(
    userId: string,
    folderId: string,
    targetParentId: string | null,
  ) {
    const folder = await this.getFolderById(userId, folderId);
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folderId === targetParentId) {
      throw new BadRequestException('Cannot move folder to itself');
    }

    let newLocation = 'root';

    if (targetParentId) {
      const targetParent = await this.getFolderById(userId, targetParentId);
      if (!targetParent) {
        throw new NotFoundException('Target parent folder not found');
      }

      if (await this.isDescendant(userId, targetParentId, folderId)) {
        throw new BadRequestException(
          'Cannot move folder to its own descendant',
        );
      }

      newLocation =
        targetParent.location === 'root'
          ? targetParent.name
          : `${targetParent.location}/${targetParent.name}`;
    }

    await db
      .update(folders)
      .set({
        parentId: targetParentId,
        location: newLocation,
        updatedAt: new Date(),
      })
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));

    await this.updateDescendantLocations(
      userId,
      folderId,
      newLocation,
      folder.name,
    );

    return await this.getFolderById(userId, folderId);
  }

  private async isDescendant(
    userId: string,
    potentialDescendant: string,
    ancestor: string,
  ): Promise<boolean> {
    const folder = await this.getFolderById(userId, potentialDescendant);
    if (!folder || !folder.parentId) {
      return false;
    }

    if (folder.parentId === ancestor) {
      return true;
    }

    return this.isDescendant(userId, folder.parentId, ancestor);
  }

  private async updateDescendantLocations(
    userId: string,
    parentId: string,
    parentLocation: string,
    parentName: string,
  ) {
    const newParentPath =
      parentLocation === 'root'
        ? parentName
        : `${parentLocation}/${parentName}`;

    const subfolders = await this.getFoldersByParent(userId, parentId);

    for (const subfolder of subfolders) {
      const newSubfolderLocation = `${newParentPath}/${subfolder.name}`;

      await db
        .update(folders)
        .set({
          location: newSubfolderLocation,
          updatedAt: new Date(),
        })
        .where(and(eq(folders.id, subfolder.id), eq(folders.userId, userId)));

      await this.updateDescendantLocations(
        userId,
        subfolder.id,
        newParentPath,
        subfolder.name,
      );
    }

    await db
      .update(files)
      .set({
        location: newParentPath,
        updatedAt: new Date(),
      })
      .where(and(eq(files.folderId, parentId), eq(files.userId, userId)));
  }
}
