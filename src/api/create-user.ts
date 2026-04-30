import { createUser, getUserFromUsername } from "../db/queries/users.js";
import { processPassword } from "./auth/password.js";
import { Request, Response } from "express";
import { verifyUserData } from "../lib/verify-user.js";
import { UserRecord } from "../db/schema.js";
import { type dbClient, db } from "../db/index.js";
import { BadRequestError } from "./errors.js";

export type SafeUserRecord = Omit<UserRecord, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
    const user = verifyUserData(req.body);

    const userCheck = await getUserFromUsername(db, user.userName);
    if (userCheck !== undefined) {
        throw new BadRequestError("Username already exists");
    }

    const hashedPassword = await processPassword(user.password);

    const newUser: UserRecord = {
        userName: user.userName,
        hashedPassword: hashedPassword,
    }

    const userRecord = await createUser(db, newUser);
    if (!userRecord) {
        throw new Error("Query failed");
    }

    const safeUserRecord = { 
        id: userRecord.id,
        userName: userRecord.userName,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt,
    }

    res.status(201).json(safeUserRecord);
}
