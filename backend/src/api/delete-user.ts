import { Request, Response } from "express";
import { deleteAllUsers, deleteUser, getUser } from "../db/queries/users.js";
import { type dbClient, db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "./errors.js";

export async function handlerDeleteUsers(req: Request, res: Response): Promise<void> {
    await deleteAllUsers(db);
    console.log("Deleted all users");
    res.status(204).send();
}

export async function handlerDeleteUser(req: Request, res: Response): Promise<void> {
    const id = req.params.userId;
    if (!id) {
        throw new BadRequestError("Must provide user Id as path parameter");
    } 

    const userId = verifyUUID(id);
    
    const userRecord = await getUser(db, userId);
    
    const authenticatedUserId = verifyUUID(res.locals.userId);
    if (authenticatedUserId !== userRecord.id) {
        throw new ForbiddenError("Not authorized to delete user");
    }

    await deleteUser(db, authenticatedUserId);
    
    res.status(204).send();
}