import { randomBytes } from "node:crypto"
import { RefreshTokenQuery } from "../../db/queries/refresh-tokens.js";

export function generateRefreshToken(): string {
    try {
        const buffer = randomBytes(256);
        return buffer.toString("hex");
    } catch (err) {
        if (err instanceof Error) {
            throw new Error("Failed to generate random bytes");
        } else {
            throw new Error(`${err}`);
        }
    }
}

export function setupRefreshToken(userId: string, expiresIn: number): RefreshTokenQuery {
    const now = Date.now();
    const expiresAt = new Date(now + expiresIn);

    const token = generateRefreshToken();
    return {
        userId: userId,
        token: token,
        expiresAt: expiresAt,
    }
}   