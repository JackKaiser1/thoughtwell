import { Request, Response } from "express";
import { deleteAllUsers } from "../db/queries/users.js";

export async function handlerDeleteUsers(req: Request, res: Response): Promise<void> {
    await deleteAllUsers();
    console.log("Deleted all users");
}