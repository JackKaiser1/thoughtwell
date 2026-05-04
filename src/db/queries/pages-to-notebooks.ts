import { dbClient } from "../index.js";
import { eq } from "drizzle-orm";
import { type PagesToNotebooksRecord, pagesToNotebooks } from "../schema.js";


export async function createPagesToNotebooks(client: dbClient, pagesToNotebooksQuery: PagesToNotebooksRecord) {
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

