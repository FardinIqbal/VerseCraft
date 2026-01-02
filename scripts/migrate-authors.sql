-- VerseCraft Authors Migration
-- Run this in Supabase SQL Editor

-- Create authors table
CREATE TABLE IF NOT EXISTS "authors" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(100) NOT NULL,
  "slug" varchar(100) NOT NULL,
  "bio" text,
  "birth_year" integer,
  "death_year" integer,
  "nationality" varchar(50),
  "era" varchar(50),
  "portrait_url" text,
  "works_count" integer DEFAULT 0 NOT NULL,
  "followers_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "authors_slug_unique" UNIQUE("slug")
);

-- Create author_follows table
CREATE TABLE IF NOT EXISTS "author_follows" (
  "user_id" uuid NOT NULL,
  "author_id" uuid NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "author_follows_user_id_author_id_pk" PRIMARY KEY("user_id","author_id"),
  CONSTRAINT "author_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "author_follows_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action
);

-- Add author_id to posts
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "author_id" uuid REFERENCES "public"."authors"("id") ON DELETE set null;

-- Create indexes
CREATE INDEX IF NOT EXISTS "author_follows_author_id_idx" ON "author_follows" USING btree ("author_id");
CREATE INDEX IF NOT EXISTS "authors_slug_idx" ON "authors" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "authors_name_idx" ON "authors" USING btree ("name");
CREATE INDEX IF NOT EXISTS "posts_author_id_idx" ON "posts" USING btree ("author_id");
