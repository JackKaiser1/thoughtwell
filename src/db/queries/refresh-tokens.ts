import { dbClient } from "../index.js";
import { type RefreshTokenRecord, refreshTokens } from "../schema.js";
import { eq, and } from "drizzle-orm";

export type RefreshTokenQuery = Omit<RefreshTokenRecord, "createdAt" | "updatedAt" | "revokedAt">;

export async function createRefreshToken(client: dbClient, refreshTokenQuery: RefreshTokenQuery) {
    const [refreshTokenRecord] = await client 
                                            .insert(refreshTokens)
                                            .values(refreshTokenQuery)
                                            .onConflictDoNothing()
                                            .returning();
    return refreshTokenRecord;
}

export async function getRefreshToken(client: dbClient, token: string) {
    const [refreshTokenRecord] = await client
                                            .select()
                                            .from(refreshTokens)
                                            .where(eq(refreshTokens.token, token));
    return refreshTokenRecord;

}

export async function revokeRefreshToken(client: dbClient, token: string) {
    const [refreshTokenRecord] = await client
                                            .update(refreshTokens)
                                            .set({ revokedAt: new Date() })
                                            .where(eq(refreshTokens.token, token))
                                            .returning();
    return refreshTokenRecord;

}