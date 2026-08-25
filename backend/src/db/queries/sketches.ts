import { sketches, SketchRecord } from "../schema.js";
import { type dbClient } from "../index.js";

export type SketchQuery = Omit<SketchRecord, "id" | "createdAt" | "updatedAt" | "isChild">;

export async function createSketch(client: dbClient, sketch: SketchQuery) {
    const [sketchRecord] = await client
                                .insert(sketches)
                                .values(sketch)
                                .returning();
    return sketchRecord;
}