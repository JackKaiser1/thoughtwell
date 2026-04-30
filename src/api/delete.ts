import { Request, Response } from "express";
import { deleteAllUsers, deleteUser, getUser } from "../db/queries/users.js";
import { type dbClient, db } from "../db/index.js";
import { verifyUUID } from "../lib/verify-uuid.js";
import { BadRequestError } from "./errors.js";

export async function handlerDeleteUsers(req: Request, res: Response): Promise<void> {
    await deleteAllUsers(db);
    console.log("Deleted all users");
    res.status(204).send();
}

export async function handlerDeleteUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    if (!userId) {
        throw new BadRequestError("must provide user id");
    } else if (typeof userId !== "string") {
        throw new BadRequestError("user id must be a string");
    }

    verifyUUID(userId);

    await deleteUser(db, userId);
    
    const deletedUser = await getUser(db, userId);
    if (deletedUser !== undefined) {
        throw new Error("User failed to delete");
    }

    res.status(204).send();
}