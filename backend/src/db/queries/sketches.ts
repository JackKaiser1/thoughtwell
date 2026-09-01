import { type SketchMetadataRecord, sketchMetadata } from "../schema.js";
import { type dbClient } from "../index.js";
import { and, eq } from "drizzle-orm";

export type SketchMetadataQuery = Omit<SketchMetadataRecord, "id" | "createdAt" | "updatedAt" | "isChild">;

export async function createSketch(client: dbClient, sketch: SketchMetadataQuery) {
    const [sketchMetadataRecord] = await client
                                    .insert(sketchMetadata)
                                    .values(sketch)
                                    .returning();
    return sketchMetadataRecord;
}

export async function getSketch(client: dbClient, sketchId: string) {
    const [sketchMetadataRecord] = await client 
                                    .select()
                                    .from(sketchMetadata)
                                    .where(eq(sketchMetadata.id, sketchId));
    return sketchMetadataRecord;
}

export async function getLooseSketches(client: dbClient, userId: string) {
    const sketchMetadataRecords = await client
                                    .select()
                                    .from(sketchMetadata)
                                    .where(
                                        and(
                                            eq(sketchMetadata.userId, userId),
                                            eq(sketchMetadata.isChild, false)
                                        )
                                    );
    return sketchMetadataRecords;
}

export async function deleteSketch(client: dbClient, sketchId: string) {
    await client
            .delete(sketchMetadata)
            .where(eq(sketchMetadata.id, sketchId));
}

export async function makeChildSketch(client: dbClient, sketchId: string) {
    const [sketchMetadataRecord] = await client 
                                    .update(sketchMetadata)
                                    .set({ isChild: true })
                                    .where(eq(sketchMetadata.id, sketchId))
                                    .returning();
    return sketchMetadataRecord;
}