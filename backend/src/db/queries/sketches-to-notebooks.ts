import { dbClient } from "../index.js";
import { eq } from "drizzle-orm";
import { type SketchesToNotebooksRecord, sketchesToNotebooks } from "../schema.js";

export type SketchesToNotebooksQuery = Omit<SketchesToNotebooksRecord, "id" | "createdAt" | "updatedAt">

export async function createSketchesToNotebooks(client: dbClient, sketchesToNotebooksQuery: SketchesToNotebooksQuery) {
    const [sketchesToNotebooksRecord] = await client
                                                .insert(sketchesToNotebooks)
                                                .values(sketchesToNotebooksQuery)
                                                .onConflictDoNothing()
                                                .returning();
    return sketchesToNotebooksRecord;
}

export async function deleteSketchesToNotebooks(client: dbClient, sketchId: string) {
    await client   
            .delete(sketchesToNotebooks)
            .where(eq(sketchesToNotebooks.childSketchId, sketchId));
}