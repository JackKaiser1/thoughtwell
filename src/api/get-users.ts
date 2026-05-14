import { Request, Response } from "express";
import { getUsers, getUser } from "../db/queries/users.js";
import { UserRecord } from "../db/schema.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { SafeUserRecord } from "./create-user.js";


export async function handlerGetUsers(req: Request, res: Response): Promise<void> {
    const users: UserRecord[] = await getUsers(db);
    if (!users) {
        throw new NotFoundError("Users not found");
    }

    if (!users.length) {
        console.log("Users table is empty");
        res.status(200).send("OK");
        return;
    }

    console.log("-- Users:");
    for (const user of users) {
        console.log(`${user.userName}`);
    }
    console.log("--");

    res.status(200).send({ users: users});
}

export async function handlerGetUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    if (!userId) {
        throw new BadRequestError("Must provide user Id as path parameter");
    } else if (typeof userId !== "string") {
        throw new BadRequestError("User Id must be a string");
    }

    verifyUUID(userId);
            
    const userRecord = await getUser(db, userId);
    if (!userRecord) {
        throw new NotFoundError("User not found");
    }
    
    const authenticatedUserId = verifyUUID(res.locals.userId);
    if (authenticatedUserId !== userRecord.id) {
        throw new UnauthorizedError("Not authorized to access user resource");
    }

    const safeUserRecord: SafeUserRecord = {
        id: userRecord.id,
        userName: userRecord.userName,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt,
    }

    res.status(200).json(safeUserRecord);
}