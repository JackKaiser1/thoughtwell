import { describe, it, expect } from "vitest";
import { createPage, getPage, getPages, deletePage } from "../../db/queries/pages.js";
import { createUser } from "../../db/queries/users.js";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";

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