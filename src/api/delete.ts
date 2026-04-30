import { Request, Response } from "express";
import { deleteAllUsers } from "../db/queries/users.js";
import { type dbClient, db } from "../db/index.js";

export async function handlerDeleteUsers(req: Request, res: Response): Promise<void> {
    await deleteAllUsers(db);
    console.log("Deleted all users");
    res.status(204).send("Users deleted");
}