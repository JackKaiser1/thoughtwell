import { describe, it, expect, vi } from "vitest";
import { createRefreshToken, getRefreshToken, revokeRefreshToken, revokeAllRefreshTokens } from "../../db/queries/refresh-tokens.ts";
import { rollbackErrorHandler } from "../../lib/query-helpers.js";
import { db } from "../../db/index.js";
import { generateRefreshToken, setupRefreshToken } from "../../api/auth/refresh.ts";
import { RefreshTokenQuery } from "../../db/queries/refresh-tokens.ts";
import { createUser } from "../../db/queries/users.js";


describe("createRefreshToken", () => {
    it("should create refresh token in db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const refreshTokenQuery = setupRefreshToken(userId, 5.184e+9);

                const refreshTokenRecord = await createRefreshToken(tx, refreshTokenQuery);

                expect(refreshTokenRecord.token).toEqual(refreshTokenQuery.token);
                expect(refreshTokenRecord.userId).toEqual(refreshTokenQuery.userId);
                expect(refreshTokenRecord.revokedAt).toEqual(null);
                
                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("getRefreshToken", () => {
    it("should get refresh token from db", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const refreshTokenQuery = setupRefreshToken(userId, 5.184e+9);
                const token = refreshTokenQuery.token;

                const newRefreshTokenRecord = await createRefreshToken(tx, refreshTokenQuery);

                const fetchedRefreshTokenRecord = await getRefreshToken(tx, token);

                expect(newRefreshTokenRecord.token).toEqual(fetchedRefreshTokenRecord.token);
                expect(newRefreshTokenRecord.userId).toEqual(fetchedRefreshTokenRecord.userId);
                expect(newRefreshTokenRecord.expiresAt).toEqual(fetchedRefreshTokenRecord.expiresAt);
                expect(newRefreshTokenRecord.revokedAt).toEqual(fetchedRefreshTokenRecord.revokedAt);

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});

describe("revokeRefreshToken / revokeAllRefreshTokens", () => {
    it("should revoke refresh token", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const refreshTokenQuery = setupRefreshToken(userId, 5.184e+9);
                const token = refreshTokenQuery.token;

                await createRefreshToken(tx, refreshTokenQuery);

                await revokeRefreshToken(tx, token);

                const refreshTokenRecord = await getRefreshToken(tx, token);

                expect(refreshTokenRecord.revokedAt).toBeTruthy();

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });

    it("should revoke all refresh tokens", async () => {
        try {
            await db.transaction(async (tx) => {
                const user = { userName: "user1", hashedPassword: "verystronghashedpassword" };
                const userRecord = await createUser(tx, user);
                const userId = userRecord.id;

                const refreshTokenQuery = setupRefreshToken(userId, 5.184e+9);
                await createRefreshToken(tx, refreshTokenQuery);

                const refreshTokenQuery2 = setupRefreshToken(userId, 5.184e+9);
                await createRefreshToken(tx, refreshTokenQuery2);

                const revokedRefreshTokenRecords = await revokeAllRefreshTokens(tx, userId);

                expect(revokedRefreshTokenRecords[0].revokedAt).toBeTruthy();
                expect(revokedRefreshTokenRecords[1].revokedAt).toBeTruthy();

                tx.rollback();
            });
        } catch (err) {
            rollbackErrorHandler(err);
        }
    });
});