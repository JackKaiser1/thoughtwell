import { Request, Response } from "express";
import { deleteAllUsers, deleteUser, getUser } from "../db/queries/users.js";
import { type dbClient, db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";

export async function handlerDeleteUsers(req: Request, res: Response): Promise<void> {
    await deleteAllUsers(db);
    console.log("Deleted all users");
    res.status(204).send();
}

export async function handlerDeleteUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    if (!userId) {
        throw new BadRequestError("Must provide user Id as path parameter");
    } else if (typeof userId !== "string") {
        throw new BadRequestError("User Id must be a string");
    }

    verifyUUID(userId);
    
    const userRecord = await getUser(db, userId);
    
    const authenticatedUserId = verifyUUID(res.locals.userId);
    if (authenticatedUserId !== userRecord.id) {
        throw new UnauthorizedError("Not authorized to delete user");
    }

    await deleteUser(db, authenticatedUserId);
    
    res.status(204).send();
}