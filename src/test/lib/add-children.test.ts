import { type ChildrenToAdd, addChildrenToNotebook } from "../../lib/add-children.js";
import { describe, it, expect } from "vitest";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { createUser } from "../../db/queries/users.js";
import { createPage } from "../../db/queries/pages.js";
import { createNotebook } from "../../db/queries/notebooks.js";
import { createPagesToNotebooks, getPageChildren } from "../../db/queries/pages-to-notebooks.js";
import { makeChildPage } from "../../db/queries/pages.js";
import { PagesToNotebooksRecord } from "../../db/schema.js";
import { createNotebooksToNotebooks } from "../../db/queries/notebooks-to-notebooks.js";
import { makeChildNotebook } from "../../db/queries/notebooks.js";

describe("addChildrenToNotebook", () => {
    it("should add 3 pages to notebook", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const page = { pageContent: "1st note", userId: userId };
                const pageRecord = await createPage(tx, page);

                const page2 = { pageContent: "2nd note", userId: userId };
                const pageRecord2 = await createPage(tx, page2);

                const page3 = { pageContent: "3rd note", userId: userId };
                const pageRecord3 = await createPage(tx, page3);

                const notebook = { notebookName: "New Notebook", userId: userId };
                const notebookRecord = await createNotebook(tx, notebook);
                const notebookId = notebookRecord.id;

                const childrenToAdd: ChildrenToAdd = {
                    typeOfChild: "pages",
                    userId: userId,
                    notebookId: notebookId,
                    childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                }

                const childParentRecords = await addChildrenToNotebook(tx, childrenToAdd, createPagesToNotebooks, makeChildPage);

                for (const record of childParentRecords) {
                    expect(record.userId).toEqual(userRecord.id);
                    expect(record.parentNotebookId).toEqual(notebookRecord.id);
                }

                expect(childParentRecords[0].childPageId).toEqual(pageRecord.id);
                expect(childParentRecords[1].childPageId).toEqual(pageRecord2.id);
                expect(childParentRecords[2].childPageId).toEqual(pageRecord3.id);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should add notebook to notebook", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const page = { pageContent: "1st note", userId: userId };
                const pageRecord = await createPage(tx, page);

                const page2 = { pageContent: "2nd note", userId: userId };
                const pageRecord2 = await createPage(tx, page2);

                const page3 = { pageContent: "3rd note", userId: userId };
                const pageRecord3 = await createPage(tx, page3);

                const childNotebook = { notebookName: "New Notebook", userId: userId };
                const childNotebookRecord = await createNotebook(tx, childNotebook);
                const childNotebookId = childNotebookRecord.id;

                const childrenToAdd1: ChildrenToAdd = {
                    typeOfChild: "pages",
                    userId: userId,
                    notebookId: childNotebookId,
                    childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                }

                await addChildrenToNotebook(tx, childrenToAdd1, createPagesToNotebooks, makeChildPage);

                const parentNotebook = { notebookName: "Parent Notebook", userId: userId };
                const parentNotebookRecord = await createNotebook(tx, parentNotebook);
                const parentNotebookId = parentNotebookRecord.id;

                const childrenToAdd2: ChildrenToAdd = {
                    typeOfChild: "notebooks",
                    userId: userId,
                    notebookId: parentNotebookId,
                    childIds: [childNotebookId],
                }
                
                const childParentRecords = await addChildrenToNotebook(tx, childrenToAdd2, createNotebooksToNotebooks, makeChildNotebook);
                
                expect(childParentRecords[0].userId).toEqual(userRecord.id);
                expect(childParentRecords[0].parentNotebookId).toEqual(parentNotebookRecord.id);
                expect(childParentRecords[0].childNotebookId).toEqual(childNotebookRecord.id);

                
                const pageChildren = await getPageChildren(tx, childParentRecords[0].childNotebookId);

                expect(pageChildren[0].childPageId).toEqual(pageRecord.id);
                expect(pageChildren[1].childPageId).toEqual(pageRecord2.id);
                expect(pageChildren[2].childPageId).toEqual(pageRecord3.id);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});