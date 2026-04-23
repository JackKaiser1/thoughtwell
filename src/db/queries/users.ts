import { type UserRecord, users } from "../schema.js";
import { db } from "../index.js";

export async function createUser(user: UserRecord) {
    const [userObj] = await db
                                .insert(users)
                                .values(user)
                                .onConflictDoNothing()
                                .returning();
    return userObj;
}