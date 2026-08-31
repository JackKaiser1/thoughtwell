import { sketches, SketchRecord } from "../schema.js";
import { type dbClient } from "../index.js";
import { and, eq } from "drizzle-orm";

export type SketchQuery = Omit<SketchRecord, "id" | "createdAt" | "updatedAt" | "isChild">;

export async function createSketch(client: dbClient, sketch: SketchQuery) {
    const [sketchRecord] = await client
                                .insert(sketches)
                                .values(sketch)
                                .returning();
    return sketchRecord;
}

export async function getSketch(client: dbClient, sketchId: string) {
    const [sketchRecord] = await client 
                                .select()
                                .from(sketches)
                                .where(eq(sketches.id, sketchId));
    return sketchRecord;
}

export async function getLooseSketches(client: dbClient, userId: string) {
    const sketchRecords = await client
                                .select()
                                .from(sketches)
                                .where(
                                    and(
                                        eq(sketches.userId, userId),
                                        eq(sketches.isChild, false)
                                    )
                                );
    return sketchRecords;
}

export async function deleteSketch(client: dbClient, sketchId: string) {
    await client
        .delete(sketches)
        .where(eq(sketches.id, sketchId));
}

export async function makeChildSketch(client: dbClient, sketchId: string) {
    const [sketchRecord] = await client 
                                .update(sketches)
                                .set({ isChild: true })
                                .where(eq(sketches.id, sketchId))
                                .returning();
    return sketchRecord;
}