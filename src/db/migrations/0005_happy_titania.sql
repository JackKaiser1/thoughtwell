ALTER TABLE "pages_to_notebooks" RENAME COLUMN "page_id" TO "child_page_id";--> statement-breakpoint
ALTER TABLE "pages_to_notebooks" RENAME COLUMN "notebook_id" TO "parent_notebook_id";--> statement-breakpoint
ALTER TABLE "pages_to_notebooks" DROP CONSTRAINT "pages_to_notebooks_page_id_pages_id_fk";
--> statement-breakpoint
ALTER TABLE "pages_to_notebooks" DROP CONSTRAINT "pages_to_notebooks_notebook_id_notebooks_id_fk";
--> statement-breakpoint
DROP INDEX "page_of_notebook";--> statement-breakpoint
ALTER TABLE "pages_to_notebooks" ADD CONSTRAINT "pages_to_notebooks_child_page_id_pages_id_fk" FOREIGN KEY ("child_page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages_to_notebooks" ADD CONSTRAINT "pages_to_notebooks_parent_notebook_id_notebooks_id_fk" FOREIGN KEY ("parent_notebook_id") REFERENCES "public"."notebooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "page_of_notebook" ON "pages_to_notebooks" USING btree ("child_page_id","parent_notebook_id");