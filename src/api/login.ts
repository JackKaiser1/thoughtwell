import { Request, Response } from "express";
import { getUserFromUsername } from "../db/queries/users.js";
import { verifyHash } from "./auth/password.js";
import { verifyUserData } from "../lib/verify-user.js";
import { db } from "../db/index.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { type SafeUserRecord } from "./create-user.js";
import { setupRefreshToken } from "./auth/refresh.js";
import { createRefreshToken } from "../db/queries/refresh-tokens.js";
import { createJWT } from "./auth/jwt.js";
import { config } from "../config.js";

export type UserRequestData = {
    userName: string,
    password: string,
}

type SafeUserWithToken = SafeUserRecord & {
    accessToken: string,
    refreshToken: string,
}

export async function handlerLogin(req: Request, res: Response): Promise<void> {
    const userLogin = verifyUserData(req.body);

    const userRecord = await getUserFromUsername(db, userLogin.userName);
    if (!userRecord) {
        throw new NotFoundError("User not found");
    }

    const hash = userRecord.hashedPassword;
    await verifyHash(hash, userLogin.password);

    const sixtyDaysMs = 5.184e+9;
    const refreshTokenQuery = setupRefreshToken(userRecord.id, sixtyDaysMs);
    const refreshTokenRecord = await createRefreshToken(db, refreshTokenQuery);

    const oneHourMs = 3.6e+6;
    const accessToken = createJWT(userRecord.id, oneHourMs, config.secret);

    const safeUserRecord: SafeUserWithToken = {
        id: userRecord.id,
        userName: userRecord.userName,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt,
        accessToken: accessToken,
        refreshToken: refreshTokenRecord.token,
    }

    res.status(200).json(safeUserRecord);
}