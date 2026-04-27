import { type UserRecord, users } from "../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";

export async function createUser(user: UserRecord) {
    const [userObj] = await db
                                .insert(users)
                                .values(user)
                                .onConflictDoNothing()
                                .returning();
    return userObj;
}

export async function deleteUser(userId: string) {
    await db 
            .delete(users)
            .where(eq(users.id, userId));
}

export async function deleteAllUsers() {
    await db.delete(users);
}