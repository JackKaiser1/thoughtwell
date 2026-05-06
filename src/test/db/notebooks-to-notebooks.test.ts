import { describe, it, expect } from "vitest";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { type NotebooksToNotebooksQuery, createNotebooksToNotebooks, getChildren } from "../../db/queries/notebooks-to-notebooks.js";
import { createUser } from "../../db/queries/users.js";
import { createNotebook } from "../../db/queries/notebooks.js";
import { createPage } from "../../db/queries/pages.js";
import { PagesToAdd } from "../../api/add-pages-notebook.js";
import { pageToNotebookQuery } from "../../api/add-pages-notebook.js";

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

                const pagesToAdd: PagesToAdd = {
                    userId: userId,
                    notebookId: parentNotebookId,
                    pageIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                }
                
                await pageToNotebookQuery(tx, pagesToAdd);


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