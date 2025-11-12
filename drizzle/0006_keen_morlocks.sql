ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "posts" CASCADE;--> statement-breakpoint
ALTER TABLE "ai_generated_content" DROP CONSTRAINT "ai_generated_content_used_in_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "ai_generated_content" DROP COLUMN "used_in_post_id";--> statement-breakpoint
DROP TYPE "public"."post_status";