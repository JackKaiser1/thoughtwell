import { describe, it, expect } from "vitest";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { createUser } from "../../db/queries/users.js";
import { createPage } from "../../db/queries/pages.js";
import { createNotebook } from "../../db/queries/notebooks.js";
import { verifyChildrenToAdd } from "../../lib/verify-childrenToAdd.js";
import { BadRequestError, UnauthorizedError } from "../../api/errors.js";

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

                const childrenToAdd = await verifyChildrenToAdd(tx, obj, userId);

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

                    await expect(() => verifyChildrenToAdd(tx, obj, userId)).rejects.toThrow(BadRequestError);

                    tx.rollback();
                });
            } catch (err) {
                rollbackErrorHandler(err);
            }
        });

        it("should throw error when using wrong typeOfChild property", async () => {
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
                        // Wrong child type for operation
                        typeOfChild: "notebooks",
                        userId: userId,
                        notebookId: notebookId,
                        childIds: [pageRecord.id, pageRecord2.id, pageRecord3.id],
                    };
    
                    await expect(() => {
                        return verifyChildrenToAdd(tx, obj, userId)
                    }).rejects.toThrow(new BadRequestError("typeOfChild property is incorrect"));

    
                    tx.rollback();
                });
            } catch (err) {
                rollbackErrorHandler(err);
            }
        });
});