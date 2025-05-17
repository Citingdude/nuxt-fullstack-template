CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"original_filename" text,
	"mime_type" text,
	"upload_date" timestamp DEFAULT now(),
	"file_path" text,
	"url" text,
	"size" bigint
);
