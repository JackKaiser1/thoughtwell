import { describe, it, expect } from "vitest";
import { createUser, deleteUser, deleteAllUsers, getUsers } from "../../db/queries/users.js";
import { UserRecord, users } from "../../db/schema";
import { UserRequestData } from "../../lib/verify-user.js";
import { hashPassword } from "../../api/auth/password.js";
import { type dbClient, db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { text } from "node:stream/consumers";

describe("createUser", () => {
    it("should create a user in the db", async () => {
        const user: UserRecord = {userName: "user", hashedPassword: "verystronghashedpassword"};

        try { 
            await db.transaction(async (tx) => {
                const userRecord: UserRecord = await createUser<typeof tx>(tx, user);

                expect(userRecord.userName).toEqual(user.userName);
                for (const prop in userRecord) {
                    expect(prop).toBeTruthy;
                }

                tx.rollback();
            }); 
        } catch (err) {
            console.log("Rolled back db changes");
        }
    });
});