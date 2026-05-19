import { describe, it, expect } from "vitest";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { createNotebook, 
         getNotebook, 
         getNotebooks, 
         deleteNotebook, 
         deleteNotebooks, 
         makeChildNotebook,
         getTopLevelNotebooks } from "../../db/queries/notebooks.js";
import { createUser } from "../../db/queries/users.js";
import { NotebookRecord } from "../../db/schema.js";
import { makeChildren } from "../../lib/add-children.js";

describe("createNotebook", () => {
    it("should create notebook record in db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;   
                
                const notebook: NotebookRecord = { notebookName: "New Notebook", userId: userId };

                const notebookRecord = await createNotebook(tx, notebook);

                expect(notebookRecord).toBeTruthy();
                expect(notebookRecord.userId).toEqual(userRecord.id);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("getNotebook / getNotebooks", () => {
    it("should get notebook from db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;   
                
                const notebook: NotebookRecord = { notebookName: "New Notebook", userId: userId };

                const notebookRecord = await createNotebook(tx, notebook);
                const notebookId = notebookRecord.id;

                const fetchedNotebook = await getNotebook(tx, notebookId);

                expect(fetchedNotebook).toBeTruthy();
                expect(fetchedNotebook.id).toEqual(notebookRecord.id);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should get all notebooks belonging user", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;   
                
                const notebook1: NotebookRecord = { notebookName: "First Notebook", userId: userId };
                await createNotebook(tx, notebook1);

                const notebook2: NotebookRecord = { notebookName: "Second Notebook", userId: userId };
                await createNotebook(tx, notebook2);

                const notebooks = await getNotebooks(tx, userId);

                expect(notebooks.length).toBeTruthy();
                expect(notebooks.length).toBeGreaterThanOrEqual(2);
                
                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("deleteNotebook / deleteNotebooks", () => {
    it("should delete notebook from db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;   
                
                const notebook: NotebookRecord = { notebookName: "New Notebook", userId: userId };

                const notebookRecord = await createNotebook(tx, notebook);
                const notebookId = notebookRecord.id;

                await deleteNotebook(tx, notebookId);
                const deletedNotebook = await getNotebook(tx, notebookId);

                expect(deletedNotebook).toEqual(undefined);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should delete all notebooks from db belonging to user", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;   
                
                const notebook1: NotebookRecord = { notebookName: "First Notebook", userId: userId };
                await createNotebook(tx, notebook1);

                const notebook2: NotebookRecord = { notebookName: "Second Notebook", userId: userId };
                await createNotebook(tx, notebook2);

                await deleteNotebooks(tx, userId);

                const deletedNotebooks = await getNotebooks(tx, userId);

                expect(deletedNotebooks.length).toEqual(0);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("makeChildNotebook", () => {
    it("should update the isChild property of a notebook", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;   
                
                const notebook: NotebookRecord = { notebookName: "First Notebook", userId: userId };
                const notebookRecord = await createNotebook(tx, notebook);

                const updatedNotebookRecord = await makeChildNotebook(tx, notebookRecord.id);

                expect(notebookRecord.isChild).toEqual(false);
                expect(updatedNotebookRecord.isChild).toEqual(true);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("getTopLevelNotebooks", () => {
    it("should get only top level notebooks", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;   
                
                const notebook1: NotebookRecord = { notebookName: "First Notebook", userId: userId };
                const notebookRecord1 = await createNotebook(tx, notebook1);

                const notebook2: NotebookRecord = { notebookName: "Second Notebook", userId: userId };
                const notebookRecord2 = await createNotebook(tx, notebook2);

                const notebook3: NotebookRecord = { notebookName: "Third Notebook", userId: userId };
                const notebookRecord3 = await createNotebook(tx, notebook3);

                await makeChildren(tx, [notebookRecord2.id, notebookRecord3.id], makeChildNotebook);

                const allNotebooks = await getNotebooks(tx, userId);

                const topLevelNotebooks = await getTopLevelNotebooks(tx, userId);

                expect(allNotebooks.length).toBeGreaterThan(topLevelNotebooks.length);
                expect(topLevelNotebooks[0].id).toEqual(notebookRecord1.id);


                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});