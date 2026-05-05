import { Request, Response } from "express";
import { NotebookRecord } from "../db/schema.js";
import { getUserFromUsername } from "../db/queries/users.js";
import { createNotebook } from "../db/queries/notebooks.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { db } from "../db/index.js";

type NotebookRequest = {
    userName: string;
    notebookName: string;  
}

export async function handlerCreateNotebook(req: Request, res: Response) {
    const notebookReq: NotebookRequest = req.body;
    if (!notebookReq.userName) {
        throw new BadRequestError("notebook must have username");
    } else if (!notebookReq.notebookName) {
        throw new BadRequestError("notebook must have name");
    }

    const userRecord = await getUserFromUsername(db, notebookReq.userName);
    if (!userRecord) {
        throw new NotFoundError("User not found");
    }
    
    const userId = userRecord.id;

    const notebookQuery: NotebookRecord = {
        userId: userId,
        notebookName: notebookReq.notebookName,
    }

    const notebookRecord = await createNotebook(db, notebookQuery);
    if (!notebookRecord) {
        throw new Error("failed to create notebook");
    }

    res.status(201).json(notebookRecord);
}