ALTER TABLE "sketches" RENAME COLUMN "sketch_url" TO "sketch_key";--> statement-breakpoint
ALTER TABLE "sketches" DROP CONSTRAINT "sketches_sketch_url_unique";--> statement-breakpoint
ALTER TABLE "sketches" ADD CONSTRAINT "sketches_sketch_key_unique" UNIQUE("sketch_key");