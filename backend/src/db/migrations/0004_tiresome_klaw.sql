ALTER TABLE "files" ADD COLUMN "thumbnail" text;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_thumbnail_unique" UNIQUE("thumbnail");