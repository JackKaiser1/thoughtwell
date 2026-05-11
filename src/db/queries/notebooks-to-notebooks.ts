import { dbClient } from "../index.js";
import { eq } from "drizzle-orm";
import { type NotebooksToNotebooksRecord, PagesToNotebooksRecord, notebooksToNotebooks, pages, pagesToNotebooks } from "../schema.js";
import { exceptAll, unionAll } from 'drizzle-orm/pg-core'

export type NotebooksToNotebooksQuery = Omit<NotebooksToNotebooksRecord, "id" | "createdAt" | "updatedAt">;

export type TopLevelChildren = {
    pageChildren: PagesToNotebooksRecord[],
    notebookChildren: NotebooksToNotebooksRecord[],
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
    const childNotebookRecords = await client 
                                            .select()
                                            .from(pagesToNotebooks)
                                            .where(eq(pagesToNotebooks.parentNotebookId, notebookId));
    const notebookNotebooksRecords = await client 
                                                .select()
                                                .from(notebooksToNotebooks)
                                                .where(eq(notebooksToNotebooks.parentNotebookId, notebookId));

    return {
        pageChildren: childNotebookRecords,
        notebookChildren: notebookNotebooksRecords,
    };
}

export async function deleteNotebooksToNotebooks(client: dbClient, childNotebookId: string) {
    await client 
                .delete(notebooksToNotebooks)
                .where(eq(notebooksToNotebooks.childNotebookId, childNotebookId));
}