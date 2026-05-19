import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./errors.js";
import { getBearerToken } from "./auth/jwt.js";
import { getRefreshToken, revokeRefreshToken } from "../db/queries/refresh-tokens.js";
import { db } from "../db/index.js";

export async function handlerRevoke(req: Request, res: Response) {
    if (!req.headers.authorization) {
        throw new BadRequestError("Must provide refresh token in header");
    }

    const refreshToken = getBearerToken(req.headers.authorization);

    const refreshTokenRecord = await getRefreshToken(db, refreshToken);
    if (!refreshTokenRecord) {
        throw new NotFoundError("Refresh token not found");
    }

    const revokedRefreshTokenRecord = await revokeRefreshToken(db, refreshToken);

    res.status(200).json(revokedRefreshTokenRecord);
}