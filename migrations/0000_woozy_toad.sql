CREATE TABLE IF NOT EXISTS "content" (
	"id" varchar(36),
	"title" varchar,
	"version" integer,
	"created_at" timestamp,
	CONSTRAINT "content_id_version_pk" PRIMARY KEY("id","version")
);
