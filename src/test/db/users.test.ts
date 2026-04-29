import { describe, it, expect, beforeAll, onTestFailed, afterAll, afterEach } from "vitest";
import { createUser, deleteUser, deleteAllUsers, getUsers, getUser } from "../../db/queries/users.js";
import { UserRecord, users } from "../../db/schema";
import { UserRequestData } from "../../lib/verify-user.js";
import { hashPassword } from "../../api/auth/password.js";
import { type dbClient, db } from "../../db/index.js";
import { eq, TransactionRollbackError } from "drizzle-orm";
import { text } from "drizzle-orm/gel-core";
import { toValueParam } from "drizzle-orm/aws-data-api/common";
import { PgTransaction } from "drizzle-orm/pg-core";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
 

describe("createUser", () => {
    it("should create a user in the db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user: UserRecord = {userName: "user", hashedPassword: "verystronghashedpassword"};
                const userRecord: UserRecord = await createUser<typeof tx>(tx, user);

                expect(userRecord.userName).toEqual(user.userName);
                for (const prop in userRecord) {
                    expect(prop).toBeTruthy();
                }

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should return undefined for pre-existing user", async () => {
        try {
            await db.transaction(async (tx) => {
                const user: UserRecord = {userName: "user", hashedPassword: "verystronghashedpassword"};
                const userRecord: UserRecord = await createUser<typeof tx>(tx, user);

                const userRecordUndefined: UserRecord = await createUser<typeof tx>(tx, user);

                expect(userRecordUndefined).toEqual(undefined);
                
                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("deleteUser / deleteAllUsers", () => {
    it("should delete user from db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user: UserRecord = {userName: "user", hashedPassword: "verystronghashedpassword"};
                const userRecord: UserRecord = await createUser<typeof tx>(tx, user);

                expect(userRecord.userName).toEqual(user.userName);
                for (const prop in userRecord) {
                    expect(prop).toBeTruthy();
                }

                const userId = userRecord.id;
                if (!userId) {
                    throw new Error("invalid user id");
                }

                await deleteUser<typeof tx>(tx, userId);

                const deletedUser = await getUser<typeof tx>(tx, userId);

                expect(deletedUser).toEqual(undefined);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should delete all users from db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user: UserRecord = {userName: "user", hashedPassword: "verystronghashedpassword"};
                const userRecord: UserRecord = await createUser<typeof tx>(tx, user);

                const user2: UserRecord = {userName: "user", hashedPassword: "verystronghashedpassword"};
                const userRecord2: UserRecord = await createUser<typeof tx>(tx, user2);

                const allUsers = await getUsers<typeof tx>(tx);

                expect(allUsers).toBeTruthy()

                await deleteAllUsers<typeof tx>(tx);

                const deletedUsers = await getUsers<typeof tx>(tx);

                expect(deletedUsers.length).toBeFalsy();
                expect(deletedUsers.length).toEqual(0);

                tx.rollback();
            });
        } catch(err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("getUsers / getUser", () => {
    it("should get all users from db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user1: UserRecord = {userName: "user", hashedPassword: "verystronghashedpassword"};
                const userRecord1: UserRecord = await createUser<typeof tx>(tx, user1);

                const user2: UserRecord = {userName: "user", hashedPassword: "verystronghashedpassword"};
                const userRecord2: UserRecord = await createUser<typeof tx>(tx, user2);

                const allUsers = await getUsers<typeof tx>(tx);

                expect(allUsers).toBeTruthy()
                expect(allUsers[0]).toEqual(userRecord1);
                expect(allUsers[1]).toEqual(userRecord2);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should get a single user from the db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user: UserRecord = {userName: "user", hashedPassword: "verystronghashedpassword"};
                const userRecord: UserRecord = await createUser<typeof tx>(tx, user);

                const userId = userRecord.id;
                if (!userId) {
                    throw new Error("invalid user id");
                }

                const fetchedUser = await getUser<typeof tx>(tx, userId);

                expect(fetchedUser).toEqual(userRecord);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});