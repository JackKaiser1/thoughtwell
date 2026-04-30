import { Request, Response } from "express";
import { getUserFromUsername } from "../db/queries/users.js";
import { verifyHash } from "./auth/password.js";
import { verifyUserData } from "../lib/verify-user.js";
import { db } from "../db/index.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { type SafeUserRecord } from "./create-user.js";

export async function handlerLogin(req: Request, res: Response): Promise<void> {
    const userLogin = verifyUserData(req.body);

    const userRecord = await getUserFromUsername(db, userLogin.userName);
    if (!userRecord) {
        throw new NotFoundError("User not found");
    }

    const hash = userRecord.hashedPassword;
    await verifyHash(hash, userLogin.password);

    const safeUserRecord: SafeUserRecord = {
        id: userRecord.id,
        userName: userRecord.userName,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt,
    }

    res.status(200).json(safeUserRecord);
}