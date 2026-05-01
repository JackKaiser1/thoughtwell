import { dbClient } from "../index.js";
import { eq } from "drizzle-orm";
import { type NotebookRecord, notebooks, users } from "../schema.js";

export async function createNotebook(client: dbClient, notebook: NotebookRecord) {
    const [notebookRecord] = await client 
                                        .insert(notebooks)
                                        .values(notebook)
                                        .returning();
    return notebookRecord;
}

export async function getNotebook(client: dbClient, notebookId: string) {
    const [notebookRecord] = await client 
                                        .select()
                                        .from(notebooks)
                                        .where(eq(notebooks.id, notebookId));
    return notebookRecord;
}

export async function getNotebooks(client: dbClient, userId: string) {
    const notebookRecords = await client
                                    .select()
                                    .from(notebooks)
                                    .where(eq(notebooks.userId, userId));
    return notebookRecords
}

export async function deleteNotebook(client: dbClient, notebookId: string) {
    await client 
            .delete(notebooks)
            .where(eq(notebooks.id, notebookId));
}

export async function deleteNotebooks(client: dbClient, userId: string) {
    await client 
            .delete(notebooks)
            .where(eq(notebooks.userId, userId));
}