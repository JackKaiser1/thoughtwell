CREATE TABLE "notebooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notebook_name" varchar(256) NOT NULL,
	"is_child" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notebooks" ADD CONSTRAINT "notebooks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;