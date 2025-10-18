import { relations } from 'drizzle-orm';
import { pgEnum, uuid } from 'drizzle-orm/pg-core';
import {
  pgTable,
  varchar,
  text,
  timestamp,
  index,
  integer,
} from 'drizzle-orm/pg-core';

// User table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  image: varchar('image', { length: 255 }),
  password: text('password').notNull(),
  dob: text('dob'),
  gender: varchar('gender', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;

// Sessions table
export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    expiresAt: timestamp('expires_at').notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    ipAddress: varchar('ip_address', { length: 255 }),
    userAgent: varchar('user_agent', { length: 255 }),
    userId: varchar('user_id', { length: 255 }).notNull(),
  },
  (table) => [
    {
      userIdIdx: index('user_id_idx').on(table.userId),
      tokenIdx: index('token_idx').on(table.token),
      expiresAtIdx: index('expires_at_idx').on(table.expiresAt),
    },
  ],
);

export const fileTypeEnum = pgEnum('file_type', [
  'image',
  'video',
  'document',
  'other',
  'audio',
  'pdf',
  'code',
]);

export const files = pgTable(
  'files',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    url: text('url').notNull(),
    fileName: text('name').notNull(),
    type: fileTypeEnum(),
    extension: text('extension').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    location: text('location').default('root'),
    folderId: varchar('folder_id', { length: 255 }),
    userId: varchar('account_id', { length: 255 }).notNull(),
    size: integer('size').notNull(),
    thumbnail: text('thumbnail').unique(),
  },
  (table) => [
    index('file_user_id_idx').on(table.userId),
    index('file_folder_id_idx').on(table.folderId),
    index('file_type_idx').on(table.type),
    index('file_name_idx').on(table.fileName),
    index('file_created_at_idx').on(table.createdAt),
    index('file_location_idx').on(table.location),
  ],
);

export const folders = pgTable(
  'folders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    color: varchar('color', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    parentId: uuid('parent_id'),
    location: varchar('location', { length: 500 }).default('root'),
    userId: varchar('user_id', { length: 255 }).notNull(),
  },
  (table) => [
    index('folder_user_id_idx').on(table.userId),
    index('folder_parent_id_idx').on(table.parentId),
    index('folder_name_idx').on(table.name),
    index('folder_created_at_idx').on(table.createdAt),
    index('folder_location_idx').on(table.location),
  ],
);

// Relations

export const filesRelations = relations(files, ({ one }) => ({
  owner: one(users, { fields: [files.userId], references: [users.id] }),
  folder: one(folders, { fields: [files.folderId], references: [folders.id] }),
}));

export const userRelations = relations(users, ({ many }) => ({
  files: many(files),
  folders: many(folders),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  owner: one(users, { fields: [folders.id], references: [users.id] }),
  files: many(files),
  subfolders: many(folders, { relationName: 'folderToSubfolders' }),
  parentFolder: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: 'folderToSubfolders',
  }),
}));
