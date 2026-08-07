import { Request, Response } from "express";
import { getUsers, getUser } from "../db/queries/users.js";
import { UserRecord } from "../db/schema.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { SafeUserRecord } from "./create-user.js";
import { printProperties } from "../lib/print-properties.js";


export async function handlerGetUsers(req: Request, res: Response): Promise<void> {
    const users: UserRecord[] = await getUsers(db);
    if (users.length < 1) {
        throw new NotFoundError("Users not found");
    }

    printProperties(users, "username");

    res.status(200).send({ users: users });
}

export async function handlerGetUser(req: Request, res: Response): Promise<void> {
    const id = req.params.userId;
    if (!id) {
        throw new BadRequestError("Must provide user Id as path parameter");
    } 

    const userId = verifyUUID(id);
            
    const userRecord = await getUser(db, userId);
    if (!userRecord) {
        throw new NotFoundError("User not found");
    }
    
    const authenticatedUserId = verifyUUID(res.locals.userId);
    if (authenticatedUserId !== userRecord.id) {
        throw new ForbiddenError("Not authorized to access user resource");
    }

    const safeUserRecord: SafeUserRecord = {
        id: userRecord.id,
        userName: userRecord.userName,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt,
    }

    res.status(200).json(safeUserRecord);
}