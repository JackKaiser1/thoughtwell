import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { createJWT, getBearerToken } from "./auth/jwt.js";
import { getRefreshToken } from "../db/queries/refresh-tokens.js";
import { db } from "../db/index.js";
import { OneHourS } from "./api-constants.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
    if (!req.headers.authorization) {
        throw new BadRequestError("must provided refresh token in header");
    }

    const token = getBearerToken(req.headers.authorization);

    const refreshTokenRecord = await getRefreshToken(db, token);
    if (!refreshTokenRecord) {
        throw new BadRequestError("refresh token invalid");
    }

    if (refreshTokenRecord.revokedAt !== null) {
        throw new BadRequestError("refresh token has been revoked");
    }

    const expiresAt = refreshTokenRecord.expiresAt;
    if (new Date() > expiresAt) {
        throw new BadRequestError("refresh token has expired");
    }

    const userId = refreshTokenRecord.userId;
    const newAccessToken = createJWT(userId, OneHourS, config.secret);

    res.status(201).json({accessToken: newAccessToken});
}