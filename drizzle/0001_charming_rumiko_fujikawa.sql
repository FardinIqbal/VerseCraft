CREATE TABLE "author_follows" (
	"user_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "author_follows_user_id_author_id_pk" PRIMARY KEY("user_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "authors" (
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
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "author_id" uuid;--> statement-breakpoint
ALTER TABLE "author_follows" ADD CONSTRAINT "author_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "author_follows" ADD CONSTRAINT "author_follows_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "author_follows_author_id_idx" ON "author_follows" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "authors_name_idx" ON "authors" USING btree ("name");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_author_id_idx" ON "posts" USING btree ("author_id");