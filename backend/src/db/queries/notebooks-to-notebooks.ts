import { dbClient } from "../index.js";
import { eq } from "drizzle-orm";
import { type NotebooksToNotebooksRecord, PagesToNotebooksRecord, SketchesToNotebooksRecord, notebooksToNotebooks, pages, pagesToNotebooks, sketchesToNotebooks } from "../schema.js";
import { exceptAll, unionAll } from 'drizzle-orm/pg-core'

export type NotebooksToNotebooksQuery = Omit<NotebooksToNotebooksRecord, "id" | "createdAt" | "updatedAt">;

export type TopLevelChildren = {
    pageChildren: PagesToNotebooksRecord[],
    notebookChildren: NotebooksToNotebooksRecord[],
    sketchChildren: SketchesToNotebooksRecord[]
}

export async function createNotebooksToNotebooks(client: dbClient, queryData: NotebooksToNotebooksQuery) {
    const [notebooksToNotebooksRecord] = await client 
                                                    .insert(notebooksToNotebooks)
                                                    .values(queryData)
                                                    .onConflictDoNothing()
                                                    .returning();
    return notebooksToNotebooksRecord;
}

export async function getChildren(client: dbClient, notebookId: string): Promise<TopLevelChildren> {
    const pageNotebookRecords = await client 
                                            .select()
                                            .from(pagesToNotebooks)
                                            .where(eq(pagesToNotebooks.parentNotebookId, notebookId));
    const notebookNotebooksRecords = await client 
                                            .select()
                                            .from(notebooksToNotebooks)
                                            .where(eq(notebooksToNotebooks.parentNotebookId, notebookId));
    const sketchNotebookRecords = await client 
                                            .select()
                                            .from(sketchesToNotebooks)
                                            .where(eq(sketchesToNotebooks.parentNotebookId, notebookId));

    return {
        pageChildren: pageNotebookRecords,
        notebookChildren: notebookNotebooksRecords,
        sketchChildren: sketchNotebookRecords
    };
}

export async function deleteNotebooksToNotebooks(client: dbClient, childNotebookId: string) {
    await client 
                .delete(notebooksToNotebooks)
                .where(eq(notebooksToNotebooks.childNotebookId, childNotebookId));
}