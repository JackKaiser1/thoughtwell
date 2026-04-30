import { type UserRecord, users } from "../schema.js";
import { type dbClient, db } from "../index.js";
import { eq } from "drizzle-orm";

export async function createUser(client: dbClient, user: UserRecord) {
    const [userObj] = await client
                                .insert(users)
                                .values(user)
                                .onConflictDoNothing()
                                .returning();
    return userObj;
}

export async function deleteUser(client: dbClient, userId: string) {
    await client 
            .delete(users)
            .where(eq(users.id, userId));
}

export async function deleteAllUsers(client: dbClient) {
    await client.delete(users);
}

export async function getUsers(client: dbClient) {
    const usersArr = await client
                        .select()
                        .from(users);
                
    return usersArr;
}

export async function getUser(client: dbClient, userId: string) {
    const [user] = await client
                            .select()
                            .from(users)
                            .where(eq(users.id, userId));

    return user;
}

export async function getUserFromUsername(client: dbClient, userName: string) {
    const [user] = await client 
                            .select()
                            .from(users)
                            .where(eq(users.userName, userName));
    return user;
}