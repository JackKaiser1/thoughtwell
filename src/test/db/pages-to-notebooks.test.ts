import { describe, it, expect } from "vitest";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { createPagesToNotebooks, getPageChildren, deletePagesToNotebooks } from "../../db/queries/pages-to-notebooks.js";
import { createUser } from "../../db/queries/users.js";
import { createPage, makeChildPage, getLoosePages, removeAsChildPage } from "../../db/queries/pages.js";
import { createNotebook } from "../../db/queries/notebooks.js";
import { notebooks, PagesToNotebooksRecord } from "../../db/schema.js";
import { type ChildrenToAdd, addChildrenToNotebook } from "../../lib/add-children.js";



describe("createPagesToNotebooks", () => {
    it("should create pagesToNoteBooks record in db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const page = { pageContent: "This is a note on a page", userId: userId };
                const pageRecord = await createPage(tx, page);
                const pageId = pageRecord.id;

                const notebook = { notebookName: "New Notebook", userId: userId };
                const notebookRecord = await createNotebook(tx, notebook);
                const notebookId = notebookRecord.id;

                const pagesToNoteBooksQuery = {
                    userId: userId,
                    childPageId: pageId,
                    parentNotebookId: notebookId
                };

                const pagesToNoteBooksRecord = await createPagesToNotebooks(tx, pagesToNoteBooksQuery);
                
                expect(pagesToNoteBooksRecord).toBeTruthy();
                expect(pagesToNoteBooksRecord.userId).toEqual(userRecord.id);
                expect(pagesToNoteBooksRecord.childPageId).toEqual(pageRecord.id);
                expect(pagesToNoteBooksRecord.parentNotebookId).toEqual(notebookRecord.id);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("getPageChildren", () => {
    it("should get all page children of given notebook", async () => {
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

                const pages = [pageRecord, pageRecord2, pageRecord3];
                const pagePromises = [];

                for (const page of pages) {
                    const pagesToNotebooksQuery = {
                        userId: userId,
                        childPageId: page.id,
                        parentNotebookId: notebookId,
                    }
                    pagePromises.push(createPagesToNotebooks(tx, pagesToNotebooksQuery));
                }

                await Promise.all(pagePromises);

                const pagesToNoteBooksRecords = await getPageChildren(tx, notebookId);

                expect(pagesToNoteBooksRecords.length).toBeGreaterThanOrEqual(3);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("pageToNotebookQuery", () => {
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

                const pagesToAdd: ChildrenToAdd = {
                    typeOfChild: "pages",
                    userId: userId,
                    notebookId: notebookId,
                    childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                }

                const childParentRecords = await addChildrenToNotebook(tx, pagesToAdd, deletePagesToNotebooks, createPagesToNotebooks, makeChildPage);
                
                expect(childParentRecords.length).toEqual(pagesToAdd.childIds.length);
                expect(childParentRecords[0].childPageId).toEqual(pageRecord.id);
                expect(childParentRecords[1].childPageId).toEqual(pageRecord2.id);
                expect(childParentRecords[2].childPageId).toEqual(pageRecord3.id);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("deletePagesToNotebooks", () => {
    it("should delete page from notebook", async () => {
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

                const pagesToAdd: ChildrenToAdd = {
                    typeOfChild: "pages",
                    userId: userId,
                    notebookId: notebookId,
                    childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                }

                const childParentRecords = await addChildrenToNotebook(tx, pagesToAdd, deletePagesToNotebooks, createPagesToNotebooks, makeChildPage);

                await deletePagesToNotebooks(tx, pageRecord3.id);

                const newLoosePage = await removeAsChildPage(tx, pageRecord3.id);

                const loosePages = await getLoosePages(tx, userId);

                const childrenOfNotebook = await getPageChildren(tx, notebookId);
                
                
                expect(loosePages[0].id).toEqual(newLoosePage.id);
                expect(childrenOfNotebook.length).toEqual(2);

                
                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("", () => {
    it("", async () => {
        try {
            await db.transaction(async (tx) => {

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});