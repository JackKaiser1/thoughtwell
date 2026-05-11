import { dbClient } from "../index.js";
import { eq } from "drizzle-orm";
import { type PagesToNotebooksRecord, pagesToNotebooks } from "../schema.js";

export type PagesToNotebooksQuery = Omit<PagesToNotebooksRecord, "id" | "createdAt" | "updatedAt">;

export async function createPagesToNotebooks(client: dbClient, pagesToNotebooksQuery: PagesToNotebooksQuery) {
    const [pagesToNoteBooksRecord] = await client
                                                .insert(pagesToNotebooks)
                                                .values(pagesToNotebooksQuery)
                                                .onConflictDoNothing()
                                                .returning();
    return pagesToNoteBooksRecord;
}

export async function getPageChildren(client: dbClient, notebookId: string) {
    const PagesToNotebooksRecord = await client 
                                                .select()
                                                .from(pagesToNotebooks)
                                                .where(eq(pagesToNotebooks.parentNotebookId, notebookId));
    return PagesToNotebooksRecord;
}

export async function deletePagesToNotebooks(client: dbClient, pageId: string) {
    await client 
                .delete(pagesToNotebooks)
                .where(eq(pagesToNotebooks.childPageId, pageId));
}


