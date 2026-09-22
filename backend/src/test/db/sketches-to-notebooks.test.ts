import { describe, it, expect } from "vitest";
import { createUser } from "../../db/queries/users.js";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { type SketchesToNotebooksQuery, 
        createSketchesToNotebooks, 
        deleteSketchesToNotebooks,
        getSketchesToNotebooks } from "../../db/queries/sketches-to-notebooks.js";
import { type SketchMetadataQuery, createSketch } from "../../db/queries/sketches.js"
import { createNotebook } from "../../db/queries/notebooks.js";
import { NotebookRecord } from "../../db/schema.js";

describe("createSketchesToNotebooks", () => {
    it("should create sketchesToNotebooks record", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const notebook: NotebookRecord = { notebookName: "First Notebook", userId: userId };
                const notebookRecord = await createNotebook(tx, notebook);
                const notebookId = notebookRecord.id;

                const sketchMetadataQuery: SketchMetadataQuery = { sketchKey: "key", userId: userId };
                const sketchMetadataRecord = await createSketch(tx, sketchMetadataQuery);
                const sketchId = sketchMetadataRecord.id;

                const sketchesToNotebooksQuery: SketchesToNotebooksQuery = {
                    userId: userId,
                    parentNotebookId: notebookId,
                    childSketchId: sketchId
                }

                const sketchesToNotebooksRecord = await createSketchesToNotebooks(tx, sketchesToNotebooksQuery);

                expect(sketchesToNotebooksRecord).toBeTruthy();
                expect(sketchesToNotebooksRecord.userId).toBe(userId);
                expect(sketchesToNotebooksRecord.childSketchId).toBe(sketchId);
                expect(sketchesToNotebooksRecord.parentNotebookId).toBe(notebookId);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("deleteSketchesToNotebooks", () => {
    it("should delete sketchesToNotebooks record", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const notebook: NotebookRecord = { notebookName: "First Notebook", userId: userId };
                const notebookRecord = await createNotebook(tx, notebook);
                const notebookId = notebookRecord.id;

                const sketchMetadataQuery: SketchMetadataQuery = { sketchKey: "key", userId: userId };
                const sketchMetadataRecord = await createSketch(tx, sketchMetadataQuery);
                const sketchId = sketchMetadataRecord.id;

                const sketchesToNotebooksQuery: SketchesToNotebooksQuery = {
                    userId: userId,
                    parentNotebookId: notebookId,
                    childSketchId: sketchId
                }

                const sketchesToNotebooksRecord = await createSketchesToNotebooks(tx, sketchesToNotebooksQuery);

                await deleteSketchesToNotebooks(tx, sketchId);

                const deletedSketchesToNotebooksrecord = await getSketchesToNotebooks(tx, sketchesToNotebooksRecord.id);

                expect(deletedSketchesToNotebooksrecord).toBeUndefined();

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});