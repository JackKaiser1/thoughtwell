import { describe, it, expect } from "vitest";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { type SketchMetadataQuery, createSketch, getSketch, getLooseSketches, deleteSketch, makeChildSketch } from "../../db/queries/sketches.js"
import { createUser } from "../../db/queries/users.js";

describe("createSketch", () => {
    it("Should create sketch metadata record", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const sketchMetadataQuery: SketchMetadataQuery = { sketchKey: "key", userId: userId };
                const sketchMetadataRecord = await createSketch(tx, sketchMetadataQuery);
                
                expect(sketchMetadataRecord).toBeTruthy();
                expect(sketchMetadataRecord.userId).toBe(userId);

                tx.rollback();
            })
        } catch (err) {
            rollbackErrorHandler(err);
        }
    })
});

describe("getSketch", () => {
    it("Should get sketch metadata record", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const sketchMetadataQuery: SketchMetadataQuery = { sketchKey: "key", userId: userId };
                const sketchMetadataRecord = await createSketch(tx, sketchMetadataQuery);
                const sketchId = sketchMetadataRecord.id;

                const fetchedSketchMetadataRecord = await getSketch(tx, sketchId);

                expect(fetchedSketchMetadataRecord).toBeTruthy();
                expect(fetchedSketchMetadataRecord.userId).toBe(userId);
                expect(fetchedSketchMetadataRecord.id).toBe(sketchId);

                tx.rollback();
            })
        } catch (err) {
            rollbackErrorHandler(err);
        }
    })
});

describe("getLooseSketches", () => {
    it("Should get loose sketch metadata records", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const sketchMetadataQuery1: SketchMetadataQuery = { sketchKey: "key1", userId: userId };
                const sketchMetadataRecord1 = await createSketch(tx, sketchMetadataQuery1);

                const sketchMetadataQuery2: SketchMetadataQuery = { sketchKey: "key2", userId: userId };
                const sketchMetadataRecord2 = await createSketch(tx, sketchMetadataQuery2);

                const sketchMetadataQuery3: SketchMetadataQuery = { sketchKey: "key3", userId: userId };
                const sketchMetadataRecord3 = await createSketch(tx, sketchMetadataQuery3);
                const childSketchMetadataRecord = await makeChildSketch(tx, sketchMetadataRecord3.id);

                const looseSketches = await getLooseSketches(tx, userId);

                for (const sketchMetadataRecord of looseSketches) {
                    expect(sketchMetadataRecord.isChild).toBe(false);
                }

                expect(looseSketches.length).toBe(2);
                expect(childSketchMetadataRecord.isChild).toBe(true);

                tx.rollback();
            })
        } catch (err) {
            rollbackErrorHandler(err);
        }
    })
});

describe("deleteSketch", () => {
    it("Should delete sketch metadata record", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const sketchMetadataQuery: SketchMetadataQuery = { sketchKey: "key", userId: userId };
                const sketchMetadataRecord = await createSketch(tx, sketchMetadataQuery);
                const sketchId = sketchMetadataRecord.id;

                await deleteSketch(tx, sketchId);

                const deletedSketchMetadataRecord = await getSketch(tx, sketchId);

                expect(deletedSketchMetadataRecord).toBeUndefined();

                tx.rollback();
            })
        } catch (err) {
            rollbackErrorHandler(err);
        }
    })
});



