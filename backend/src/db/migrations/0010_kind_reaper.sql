ALTER TABLE "sketches" RENAME TO "sketch_metadata";--> statement-breakpoint
ALTER TABLE "sketch_metadata" DROP CONSTRAINT "sketches_sketch_key_unique";--> statement-breakpoint
ALTER TABLE "sketch_metadata" DROP CONSTRAINT "sketches_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sketch_metadata" ADD CONSTRAINT "sketch_metadata_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sketch_metadata" ADD CONSTRAINT "sketch_metadata_sketch_key_unique" UNIQUE("sketch_key");