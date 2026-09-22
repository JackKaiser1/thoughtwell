CREATE TABLE "sketches_to_notebooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"child_sketch_id" uuid NOT NULL,
	"parent_notebook_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sketches_to_notebooks" ADD CONSTRAINT "sketches_to_notebooks_child_sketch_id_sketch_metadata_id_fk" FOREIGN KEY ("child_sketch_id") REFERENCES "public"."sketch_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sketches_to_notebooks" ADD CONSTRAINT "sketches_to_notebooks_parent_notebook_id_notebooks_id_fk" FOREIGN KEY ("parent_notebook_id") REFERENCES "public"."notebooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sketches_to_notebooks" ADD CONSTRAINT "sketches_to_notebooks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sketch_of_notebook" ON "sketches_to_notebooks" USING btree ("child_sketch_id","parent_notebook_id");