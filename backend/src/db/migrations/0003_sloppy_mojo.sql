ALTER TABLE "files" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "location" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "location" SET DEFAULT 'root';