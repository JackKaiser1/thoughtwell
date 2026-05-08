import { type ChildrenToAdd, 
        addChildrenToNotebook, 
        verifyChildrenToAdd, 
        isChildrenToAdd,
        addChildrenQuery,
        isPagesToNotebooksRecord, 
        isNotebooksToNotebooksRecord,
        makeChildren} from "../../lib/add-children.js";
import { describe, it, expect } from "vitest";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { createUser } from "../../db/queries/users.js";
import { createPage } from "../../db/queries/pages.js";
import { createNotebook } from "../../db/queries/notebooks.js";
import { createPagesToNotebooks, getPageChildren, PagesToNotebooksQuery } from "../../db/queries/pages-to-notebooks.js";
import { makeChildPage } from "../../db/queries/pages.js";
import { NotebooksToNotebooksRecord, PagesToNotebooksRecord, PageRecord, NotebookRecord } from "../../db/schema.js";
import { createNotebooksToNotebooks, NotebooksToNotebooksQuery } from "../../db/queries/notebooks-to-notebooks.js";
import { makeChildNotebook } from "../../db/queries/notebooks.js";
import { BadRequestError } from "../../api/errors.js";

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
                };

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
                };

                await addChildrenToNotebook(tx, childrenToAdd1, createPagesToNotebooks, makeChildPage);

                const parentNotebook = { notebookName: "Parent Notebook", userId: userId };
                const parentNotebookRecord = await createNotebook(tx, parentNotebook);
                const parentNotebookId = parentNotebookRecord.id;

                const childrenToAdd2: ChildrenToAdd = {
                    typeOfChild: "notebooks",
                    userId: userId,
                    notebookId: parentNotebookId,
                    childIds: [childNotebookId],
                };
                
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

describe("verifyChildrenToAdd", () => {
    it("should verify unknown object and return ChildrenToAdd type", async () => {
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

                const obj = {
                    typeOfChild: "pages",
                    userId: userId,
                    notebookId: notebookId,
                    childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                };

                const childrenToAdd = verifyChildrenToAdd(obj);

                expect(childrenToAdd.typeOfChild).toEqual("pages");
                expect(childrenToAdd.userId).toEqual(userRecord.id);
                expect(childrenToAdd.notebookId).toEqual(notebookRecord.id);
        
                expect(childrenToAdd.childIds[0]).toEqual(pageRecord.id);
                expect(childrenToAdd.childIds[1]).toEqual(pageRecord2.id);
                expect(childrenToAdd.childIds[2]).toEqual(pageRecord3.id);

                

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });


    it("should throw an error due to malformed UUID on userId", async () => {
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

                    const obj = {
                        typeOfChild: "pages",
                        // malformed uuid
                        userId: "uuid",
                        notebookId: notebookId,
                        childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                    };

                    expect(() => verifyChildrenToAdd(obj)).toThrow(BadRequestError);

                    tx.rollback();
                });
            } catch (err) {
                rollbackErrorHandler(err);
            }
        });
});

describe("isChildrenToAdd", () => {
    it("should return true for proper shape", async () => {
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

                const obj = {
                    typeOfChild: "pages",
                    userId: userId,
                    notebookId: notebookId,
                    childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                };

                const isType = isChildrenToAdd(obj);

                expect(isType).toEqual(true);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should return false for improper shape", async () => {
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

                const obj = {
                    // malformed string literal union
                    typeOfChild: 1,
                    userId: userId,
                    notebookId: notebookId,
                    childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                };

                const isType = isChildrenToAdd(obj);

                expect(isType).toEqual(false);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});


describe("addChildrenQuery", () => {
    it("should create 3 pageToNotebooks records", async () => {
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

                const obj = {
                    typeOfChild: "pages",
                    userId: userId,
                    notebookId: notebookId,
                    childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                };

                const childrenToAdd = verifyChildrenToAdd(obj);

                const pageToNotebooksRecords = await addChildrenQuery(tx, childrenToAdd, createPagesToNotebooks) as PagesToNotebooksRecord[];

                expect(pageToNotebooksRecords[0].childPageId).toEqual(pageRecord.id);
                expect(pageToNotebooksRecords[1].childPageId).toEqual(pageRecord2.id);
                expect(pageToNotebooksRecords[2].childPageId).toEqual(pageRecord3.id);


                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should throw db error when createing pagesToNotebooks Record", async () => {
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

                const obj: ChildrenToAdd = {
                    // Wrong child type for operation - throwing db error
                    typeOfChild: "notebooks",
                    userId: userId,
                    notebookId: notebookId,
                    childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                };

                const childrenToAdd = verifyChildrenToAdd(obj);

                await expect(async () => addChildrenQuery(tx, obj, createPagesToNotebooks)).rejects.toThrow();


                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should create notebooksToNotebooks record", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const childNotebook = { notebookName: "New Notebook", userId: userId };
                const childNotebookRecord = await createNotebook(tx, childNotebook);
                const childNotebookId = childNotebookRecord.id;

                const parentNotebook = { notebookName: "New Notebook", userId: userId };
                const parentNotebookRecord = await createNotebook(tx, parentNotebook);
                const parentNotebookId = parentNotebookRecord.id;

                const obj = {
                    typeOfChild: "notebooks",
                    userId: userId,
                    notebookId: parentNotebookId,
                    childIds: [childNotebookId],
                };

                const childrenToAdd = verifyChildrenToAdd(obj);

                const childParentRecords = await addChildrenQuery(tx, childrenToAdd, createNotebooksToNotebooks) as NotebooksToNotebooksRecord[];

                expect(childParentRecords[0].childNotebookId).toEqual(childNotebookRecord.id);
                expect(childParentRecords[0].parentNotebookId).toEqual(parentNotebookRecord.id);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should throw db error when creating notebooksToNotebooks record", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const childNotebook = { notebookName: "New Notebook", userId: userId };
                const childNotebookRecord = await createNotebook(tx, childNotebook);
                const childNotebookId = childNotebookRecord.id;

                const parentNotebook = { notebookName: "New Notebook", userId: userId };
                const parentNotebookRecord = await createNotebook(tx, parentNotebook);
                const parentNotebookId = parentNotebookRecord.id;

                const obj = {
                    // Wrong child type for operation - throwing db error
                    typeOfChild: "pages",
                    userId: userId,
                    notebookId: parentNotebookId,
                    childIds: [childNotebookId],
                };

                const childrenToAdd = verifyChildrenToAdd(obj);

                await expect(() => addChildrenQuery(tx, childrenToAdd, createNotebooksToNotebooks)).rejects.toThrow();

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("isPagesToNotebooksRecord", () => {
    it("should return true for proper type", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const page = { pageContent: "1st note", userId: userId };
                const pageRecord = await createPage(tx, page);

                const notebook = { notebookName: "New Notebook", userId: userId };
                const notebookRecord = await createNotebook(tx, notebook);
                const notebookId = notebookRecord.id;

                const pagesToNotebooksQuery: PagesToNotebooksQuery = {
                    userId: userId,
                    parentNotebookId: notebookId,
                    childPageId: pageRecord.id
                }

                const pagesToNotebooksRecord = await createPagesToNotebooks(tx, pagesToNotebooksQuery);

                const isType = isPagesToNotebooksRecord(pagesToNotebooksRecord);

                expect(isType).toEqual(true);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should return false for improper type", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const page = { pageContent: "1st note", userId: userId };
                const pageRecord = await createPage(tx, page);

                const notebook = { notebookName: "New Notebook", userId: userId };
                const notebookRecord = await createNotebook(tx, notebook);
                const notebookId = notebookRecord.id;

                const pagesToNotebooksQuery: PagesToNotebooksQuery = {
                    userId: userId,
                    parentNotebookId: notebookId,
                    childPageId: pageRecord.id
                }

                const isType = isPagesToNotebooksRecord(pagesToNotebooksQuery);

                expect(isType).toEqual(false);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("isNotebooksToNotebooksRecord", () => {
    it("should return true for proper type", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const childNotebook = { notebookName: "New Notebook", userId: userId };
                const childNotebookRecord = await createNotebook(tx, childNotebook);
                const childNotebookId = childNotebookRecord.id;

                const parentNotebook = { notebookName: "New Notebook", userId: userId };
                const parentNotebookRecord = await createNotebook(tx, parentNotebook);
                const parentNotebookId = parentNotebookRecord.id;

                const notebooksToNotebooksQuery: NotebooksToNotebooksQuery = {
                    userId: userId,
                    parentNotebookId: parentNotebookId,
                    childNotebookId: childNotebookId,
                }

                const notebooksToNotebooksRecord = await createNotebooksToNotebooks(tx, notebooksToNotebooksQuery);

                const isType = isNotebooksToNotebooksRecord(notebooksToNotebooksRecord);

                expect(isType).toEqual(true);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should return false for improper type", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const childNotebook = { notebookName: "New Notebook", userId: userId };
                const childNotebookRecord = await createNotebook(tx, childNotebook);
                const childNotebookId = childNotebookRecord.id;

                const parentNotebook = { notebookName: "New Notebook", userId: userId };
                const parentNotebookRecord = await createNotebook(tx, parentNotebook);
                const parentNotebookId = parentNotebookRecord.id;

                const notebooksToNotebooksQuery: NotebooksToNotebooksQuery = {
                    userId: userId,
                    parentNotebookId: parentNotebookId,
                    childNotebookId: childNotebookId,
                }

                const isType = isNotebooksToNotebooksRecord(notebooksToNotebooksQuery);

                expect(isType).toEqual(false);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("makeChildren", () => {
    it("should return an array of page records with isChild=true", async () => {
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

                const pageIds = [pageRecord.id, pageRecord2.id, pageRecord3.id];

                const updatedPageRecords = await makeChildren(tx, pageIds, makeChildPage) as PageRecord[];

                for (const pageRecord of updatedPageRecords) {
                    expect(pageRecord.isChild).toEqual(true);
                }

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should return an array of notebook records with isChild=true", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const notebook = { notebookName: "New Notebook", userId: userId };
                const notebookRecord = await createNotebook(tx, notebook);
                const notebookId = notebookRecord.id;

                const notebookIds = [notebookId];

                const updatedNotebookRecords = await makeChildren(tx, notebookIds, makeChildNotebook) as NotebookRecord[];

                for (const notebookRecord of updatedNotebookRecords) {
                    expect(notebookRecord.isChild).toEqual(true);
                }

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});