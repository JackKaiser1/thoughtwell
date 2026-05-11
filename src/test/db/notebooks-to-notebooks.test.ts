import { describe, it, expect } from "vitest";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { type NotebooksToNotebooksQuery, 
        createNotebooksToNotebooks, 
        getChildren, 
        deleteNotebooksToNotebooks } from "../../db/queries/notebooks-to-notebooks.js";
import { createUser } from "../../db/queries/users.js";
import { createNotebook, removeAsChildNotebook, makeChildNotebook } from "../../db/queries/notebooks.js";
import { createPage } from "../../db/queries/pages.js";
import { type ChildrenToAdd, addChildrenQuery } from "../../lib/add-children.js";
import { createPagesToNotebooks } from "../../db/queries/pages-to-notebooks.js";

describe("createNotebooksToNotebooks", () => {
    it("should create notebooksToNotebooks record in db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const parentNotebook = { notebookName: "Outer Notebook", userId: userId };
                const parentNotebookRecord = await createNotebook(tx, parentNotebook);
                const parentNotebookId = parentNotebookRecord.id;

                const childNotebook = { notebookName: "Inner Notebook", userId: userId };
                const childNotebookRecord = await createNotebook(tx, childNotebook);
                const childNotebookId = childNotebookRecord.id;

                const queryData: NotebooksToNotebooksQuery = {
                    userId: userId,
                    childNotebookId: childNotebookId,
                    parentNotebookId: parentNotebookId,
                }

                const childParentRecord = await createNotebooksToNotebooks(tx, queryData);

                expect(childParentRecord.userId).toEqual(userRecord.id);
                expect(childParentRecord.childNotebookId).toEqual(childNotebookRecord.id);
                expect(childParentRecord.parentNotebookId).toEqual(parentNotebookRecord.id);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("getChildren", () => {
    it("should get all of the pages and notebooks children for a given notebook", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const parentNotebook = { notebookName: "Outer Notebook", userId: userId };
                const parentNotebookRecord = await createNotebook(tx, parentNotebook);
                const parentNotebookId = parentNotebookRecord.id;


                const page = { pageContent: "1st note", userId: userId };
                const pageRecord = await createPage(tx, page);

                const page2 = { pageContent: "2nd note", userId: userId };
                const pageRecord2 = await createPage(tx, page2);

                const page3 = { pageContent: "3rd note", userId: userId };
                const pageRecord3 = await createPage(tx, page3);

                const pagesToAdd: ChildrenToAdd = {
                    typeOfChild: "pages",
                    userId: userId,
                    notebookId: parentNotebookId,
                    childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                }
                
                await addChildrenQuery(tx, pagesToAdd, createPagesToNotebooks);


                const childNotebook = { notebookName: "Inner Notebook", userId: userId };
                const childNotebookRecord = await createNotebook(tx, childNotebook);
                const childNotebookId = childNotebookRecord.id;

                const queryData: NotebooksToNotebooksQuery = {
                    userId: userId,
                    childNotebookId: childNotebookId,
                    parentNotebookId: parentNotebookId,
                }

                await createNotebooksToNotebooks(tx, queryData);


                const allChildrenOfParent = await getChildren(tx, parentNotebookId);

                for (const page of allChildrenOfParent.pageChildren) {
                    expect(page.parentNotebookId).toEqual(parentNotebookRecord.id);
                }

                for (const notebook of allChildrenOfParent.notebookChildren) {
                    expect(notebook.parentNotebookId).toEqual(parentNotebookRecord.id);
                }

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("deleteNotebooksToNotebooks / removeAsChildNotebook", () => {
    it("should remove child notebook from parent notebook", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const parentNotebook = { notebookName: "Outer Notebook", userId: userId };
                const parentNotebookRecord = await createNotebook(tx, parentNotebook);
                const parentNotebookId = parentNotebookRecord.id;

                const childNotebook = { notebookName: "Inner Notebook", userId: userId };
                const childNotebookRecord = await createNotebook(tx, childNotebook);
                const childNotebookId = childNotebookRecord.id;

                const queryData: NotebooksToNotebooksQuery = {
                    userId: userId,
                    childNotebookId: childNotebookId,
                    parentNotebookId: parentNotebookId,
                }

                await createNotebooksToNotebooks(tx, queryData);

                await makeChildNotebook(tx, childNotebookId);

                
                await deleteNotebooksToNotebooks(tx, childNotebookId);

                const removedChildNotebook = await removeAsChildNotebook(tx, childNotebookId);

                const children = await getChildren(tx, parentNotebookId);
                const notebookChildren = children.notebookChildren;

                expect(notebookChildren.length).toEqual(0);
                expect(removedChildNotebook.isChild).toEqual(false);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});