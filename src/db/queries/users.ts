import { type UserRecord, users } from "../schema.js";
import { type dbClient, db } from "../index.js";
import { eq } from "drizzle-orm";

export async function createUser<T extends dbClient>(client: T, user: UserRecord) {
    const [userObj] = await client
                                .insert(users)
                                .values(user)
                                .onConflictDoNothing()
                                .returning();
    return userObj;
}

export async function deleteUser<T extends dbClient>(client: T, userId: string) {
    await client 
            .delete(users)
            .where(eq(users.id, userId));
}

export async function deleteAllUsers<T extends dbClient>(client: T) {
    await client.delete(users);
}

export async function getUsers<T extends dbClient>(client: T) {
    const usersArr = await client
                        .select()
                        .from(users);
                
    return usersArr;
}

export async function getUser<T extends dbClient>(client: T, userId: string) {
    const [user] = await client
                            .select()
                            .from(users)
                            .where(eq(users.id, userId));

    return user;
}