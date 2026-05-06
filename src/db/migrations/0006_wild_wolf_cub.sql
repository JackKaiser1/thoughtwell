CREATE TABLE "notebooks_to_notebooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"child_notebook_id" uuid NOT NULL,
	"parent_notebook_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notebooks_to_notebooks" ADD CONSTRAINT "notebooks_to_notebooks_child_notebook_id_notebooks_id_fk" FOREIGN KEY ("child_notebook_id") REFERENCES "public"."notebooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notebooks_to_notebooks" ADD CONSTRAINT "notebooks_to_notebooks_parent_notebook_id_notebooks_id_fk" FOREIGN KEY ("parent_notebook_id") REFERENCES "public"."notebooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notebooks_to_notebooks" ADD CONSTRAINT "notebooks_to_notebooks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "notebooks_of_notebooks" ON "notebooks_to_notebooks" USING btree ("child_notebook_id","parent_notebook_id");