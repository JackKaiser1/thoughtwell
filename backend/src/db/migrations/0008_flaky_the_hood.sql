CREATE TABLE "sketches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_child" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"sketch_url" text NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "sketches_sketch_url_unique" UNIQUE("sketch_url")
);
--> statement-breakpoint
ALTER TABLE "sketches" ADD CONSTRAINT "sketches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;