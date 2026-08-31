import { describe, it, expect } from "vitest";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { type SketchQuery, createSketch, getSketch, getLooseSketches, deleteSketch, makeChildSketch } from "../../db/queries/sketches.js"
import { createUser } from "../../db/queries/users.js";

describe("createSketch", () => {
    it("Should create sketch metadata record", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const sketchQuery: SketchQuery = { sketchKey: "key", userId: userId };
                const sketchRecord = await createSketch(tx, sketchQuery);
                
                expect(sketchRecord).toBeTruthy();
                expect(sketchRecord.userId).toBe(userId);

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

                const sketchQuery: SketchQuery = { sketchKey: "key", userId: userId };
                const sketchRecord = await createSketch(tx, sketchQuery);
                const sketchId = sketchRecord.id;

                const fetchedSketchRecord = await getSketch(tx, sketchId);

                expect(fetchedSketchRecord).toBeTruthy();
                expect(fetchedSketchRecord.userId).toBe(userId);
                expect(fetchedSketchRecord.id).toBe(sketchId);

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

                const sketchQuery1: SketchQuery = { sketchKey: "key1", userId: userId };
                const sketchRecord1 = await createSketch(tx, sketchQuery1);

                const sketchQuery2: SketchQuery = { sketchKey: "key2", userId: userId };
                const sketchRecord2 = await createSketch(tx, sketchQuery2);

                const sketchQuery3: SketchQuery = { sketchKey: "key3", userId: userId };
                const sketchRecord3 = await createSketch(tx, sketchQuery3);
                const childSketchRecord = await makeChildSketch(tx, sketchRecord3.id);

                const looseSketches = await getLooseSketches(tx, userId);

                for (const sketchRecord of looseSketches) {
                    expect(sketchRecord.isChild).toBe(false);
                }

                expect(looseSketches.length).toBe(2);
                expect(childSketchRecord.isChild).toBe(true);

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

                const sketchQuery: SketchQuery = { sketchKey: "key", userId: userId };
                const sketchRecord = await createSketch(tx, sketchQuery);
                const sketchId = sketchRecord.id;

                await deleteSketch(tx, sketchId);

                const deletedSketchRecord = await getSketch(tx, sketchId);

                expect(deletedSketchRecord).toBeUndefined();

                tx.rollback();
            })
        } catch (err) {
            rollbackErrorHandler(err);
        }
    })
});



