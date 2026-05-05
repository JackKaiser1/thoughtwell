import { describe, it, expect } from "vitest";
import { createPage, getPage, getPages, deletePage, makeChildPage, getLoosePages } from "../../db/queries/pages.js";
import { createUser } from "../../db/queries/users.js";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { makePageChildren } from "../../api/add-pages-notebook.js";

describe("createPage", () => {
    it("should create page in db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const page = { pageContent: "This is a note on a page", userId: userId };
                const pageRecord = await createPage(tx, page);

                expect(pageRecord.pageContent).toEqual(page.pageContent);
                expect(pageRecord.userId).toEqual(userRecord.id);
                for (const prop in pageRecord) {
                    expect(prop).toBeTruthy();
                }

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("getPage / get pages", () => {
    it("should get page from db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const page = { pageContent: "This is a note on a page", userId: userId };
                const pageRecord = await createPage(tx, page);

                const fetchedPage = await getPage(tx, pageRecord.id);

                expect(fetchedPage).toEqual(pageRecord);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should get all pages from db for user", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const page1 = { pageContent: "This is a note on a page", userId: userId };
                const pageRecord1 = await createPage(tx, page1);

                const page2 = { pageContent: "This is a new note on a new page", userId: userId };
                const pageRecord2 = await createPage(tx, page2);

                const pages = await getPages(tx, userId);

                expect(pages.length).toBeTruthy();
                expect(pages.length).toBeGreaterThanOrEqual(2);


                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("deletePage", () => {
    it("should delete page from db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const page = { pageContent: "This is a note on a page", userId: userId };
                const pageRecord = await createPage(tx, page);

                await deletePage(tx, pageRecord.id);
                const deletedPage = await getPage(tx, pageRecord.id);

                expect(deletedPage).toEqual(undefined);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("makeChildPage", () => {
    it("should update isChild field to true", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const page = { pageContent: "This is a note on a page", userId: userId };
                const pageRecord = await createPage(tx, page);

                const updatedPageRecord = await makeChildPage(tx, pageRecord.id);

                expect(updatedPageRecord.isChild).toEqual(true);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("makePageChildren", () => {
    it("should update isChild to true for 3 pages", async () => {
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

                const pageRecords = await makePageChildren(tx, pageIds);

                for (let i = 0; i < pageRecords.length; i++) {
                    expect(pageRecords[i].isChild).toEqual(true);
                }

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("getLoosePages", () => {
    it("should get 2 unused pages out of 3 total pages", async () => {
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

                await makePageChildren(tx, [pageRecord3.id]);

                const loosePages = await getLoosePages(tx, userId);
                const allPages = await getPages(tx, userId);

                for (let i = 0; i < loosePages.length; i++) {
                    expect(loosePages[i].isChild).toEqual(false);
                }

                expect(loosePages.length).toBeLessThan(allPages.length);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});