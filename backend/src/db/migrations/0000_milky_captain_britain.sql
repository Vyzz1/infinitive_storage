CREATE TYPE "public"."file_type" AS ENUM('image', 'video', 'document', 'other', 'audio', 'pdf');--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "file_type",
	"extension" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"location" varchar(500) DEFAULT 'root',
	"folder_id" varchar(255),
	"account_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"color" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"parent_id" uuid,
	"location" varchar(500) DEFAULT 'root',
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"ip_address" varchar(255),
	"user_agent" varchar(255),
	"user_id" varchar(255) NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"image" varchar(255),
	"password" text NOT NULL,
	"dob" text,
	"gender" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "file_user_id_idx" ON "files" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "file_folder_id_idx" ON "files" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "file_type_idx" ON "files" USING btree ("type");--> statement-breakpoint
CREATE INDEX "file_name_idx" ON "files" USING btree ("name");--> statement-breakpoint
CREATE INDEX "file_created_at_idx" ON "files" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "file_location_idx" ON "files" USING btree ("location");--> statement-breakpoint
CREATE INDEX "folder_user_id_idx" ON "folders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "folder_parent_id_idx" ON "folders" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "folder_name_idx" ON "folders" USING btree ("name");--> statement-breakpoint
CREATE INDEX "folder_created_at_idx" ON "folders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "folder_location_idx" ON "folders" USING btree ("location");